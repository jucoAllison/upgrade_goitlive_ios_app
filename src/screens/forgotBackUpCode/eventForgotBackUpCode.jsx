// /*
//  * Copyright (c) Meta Platforms, Inc. and affiliates.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// #pragma once
// #define FOLLY_ARENA_H_

// #include <cassert>
// #include <limits>
// #include <stdexcept>
// #include <utility>

// #include <boost/intrusive/slist.hpp>

// #include <folly/Conv.h>
// #include <folly/Likely.h>
// #include <folly/Memory.h>
// #include <folly/lang/Align.h>
// #include <folly/lang/CheckedMath.h>
// #include <folly/lang/Exception.h>
// #include <folly/memory/Malloc.h>

// namespace folly {

// /**
//  * Simple arena: allocate memory which gets freed when the arena gets
//  * destroyed.
//  *
//  * The arena itself allocates memory using a custom allocator which conforms
//  * to the C++ concept Allocator.
//  *
//  *   http://en.cppreference.com/w/cpp/concept/Allocator
//  *
//  * You may also specialize ArenaAllocatorTraits for your allocator type to
//  * provide:
//  *
//  *   size_t goodSize(const Allocator& alloc, size_t size) const;
//  *      Return a size (>= the provided size) that is considered "good" for your
//  *      allocator (for example, if your allocator allocates memory in 4MB
//  *      chunks, size should be rounded up to 4MB).  The provided value is
//  *      guaranteed to be rounded up to a multiple of the maximum alignment
//  *      required on your system; the returned value must be also.
//  *
//  * An implementation that uses malloc() / free() is defined below, see SysArena.
//  */
// template <class Alloc>
// struct ArenaAllocatorTraits;
// template <class Alloc>
// class Arena {
//  public:
//   explicit Arena(
//       const Alloc& alloc,
//       size_t minBlockSize = kDefaultMinBlockSize,
//       size_t sizeLimit = kNoSizeLimit,
//       size_t maxAlign = kDefaultMaxAlign)
//       : allocAndSize_(alloc, minBlockSize),
//         currentBlock_(blocks_.last()),
//         ptr_(nullptr),
//         end_(nullptr),
//         totalAllocatedSize_(0),
//         bytesUsed_(0),
//         sizeLimit_(sizeLimit),
//         maxAlign_(maxAlign) {
//     if ((maxAlign_ & (maxAlign_ - 1)) || maxAlign_ > alignof(Block)) {
//       throw_exception<std::invalid_argument>(
//           folly::to<std::string>("Invalid maxAlign: ", maxAlign_));
//     }
//   }

//   ~Arena() {
//     freeBlocks();
//     freeLargeBlocks();
//   }

//   void* allocate(size_t size) {
//     size = roundUp(size);
//     bytesUsed_ += size;

//     assert(ptr_ <= end_);
//     if (FOLLY_LIKELY((size_t)(end_ - ptr_) >= size)) {
//       // Fast path: there's enough room in the current block
//       char* r = ptr_;
//       ptr_ += size;
//       assert(isAligned(r));
//       return r;
//     }

//     if (canReuseExistingBlock(size)) {
//       currentBlock_++;
//       char* r = currentBlock_->start();
//       ptr_ = r + size;
//       end_ = r + blockGoodAllocSize() - sizeof(Block);
//       assert(ptr_ <= end_);
//       assert(isAligned(r));
//       return r;
//     }

//     // Not enough room in the current block
//     void* r = allocateSlow(size);
//     assert(isAligned(r));
//     return r;
//   }

//   void deallocate(void* /* p */, size_t = 0) {
//     // Deallocate? Never!
//   }

//   // Transfer ownership of all memory allocated from "other" to "this".
//   void merge(Arena&& other);

//   void clear() {
//     bytesUsed_ = 0;
//     freeLargeBlocks(); // We don't reuse large blocks
//     if (blocks_.empty()) {
//       return;
//     }
//     currentBlock_ = blocks_.begin();
//     char* start = currentBlock_->start();
//     ptr_ = start;
//     end_ = start + blockGoodAllocSize() - sizeof(Block);
//     assert(ptr_ <= end_);
//   }

//   // Gets the total memory used by the arena
//   size_t totalSize() const { return totalAllocatedSize_ + sizeof(Arena); }

//   // Gets the total number of "used" bytes, i.e. bytes that the arena users
//   // allocated via the calls to `allocate`. Doesn't include fragmentation, e.g.
//   // if block size is 4KB and you allocate 2 objects of 3KB in size,
//   // `bytesUsed()` will be 6KB, while `totalSize()` will be 8KB+.
//   size_t bytesUsed() const { return bytesUsed_; }

//   // not copyable or movable
//   Arena(const Arena&) = delete;
//   Arena& operator=(const Arena&) = delete;
//   Arena(Arena&&) = delete;
//   Arena& operator=(Arena&&) = delete;

//  private:
//   using AllocTraits =
//       typename std::allocator_traits<Alloc>::template rebind_traits<char>;
//   using BlockLink = boost::intrusive::slist_member_hook<>;

//   struct alignas(max_align_v) Block {
//     BlockLink link;

//     char* start() { return reinterpret_cast<char*>(this + 1); }

//     Block() = default;
//     ~Block() = default;
//   };

//   constexpr size_t blockGoodAllocSize() {
//     return ArenaAllocatorTraits<Alloc>::goodSize(
//         alloc(), sizeof(Block) + minBlockSize());
//   }

//   struct alignas(max_align_v) LargeBlock {
//     BlockLink link;
//     const size_t allocSize;

//     char* start() { return reinterpret_cast<char*>(this + 1); }

//     LargeBlock(size_t s) : allocSize(s) {}
//     ~LargeBlock() = default;
//   };

//   bool canReuseExistingBlock(size_t size) {
//     if (size > minBlockSize()) {
//       // We don't reuse large blocks
//       return false;
//     }
//     if (blocks_.empty() || currentBlock_ == blocks_.last()) {
//       // No regular blocks to reuse
//       return false;
//     }
//     return true;
//   }

//   void freeBlocks() {
//     blocks_.clear_and_dispose([this](Block* b) {
//       b->~Block();
//       AllocTraits::deallocate(
//           alloc(), reinterpret_cast<char*>(b), blockGoodAllocSize());
//     });
//   }

//   void freeLargeBlocks() {
//     largeBlocks_.clear_and_dispose([this](LargeBlock* b) {
//       auto size = b->allocSize;
//       totalAllocatedSize_ -= size;
//       b->~LargeBlock();
//       AllocTraits::deallocate(alloc(), reinterpret_cast<char*>(b), size);
//     });
//   }

//  public:
//   static constexpr size_t kDefaultMinBlockSize = 4096 - sizeof(Block);
//   static constexpr size_t kNoSizeLimit = 0;
//   static constexpr size_t kDefaultMaxAlign = alignof(Block);
//   static constexpr size_t kBlockOverhead = sizeof(Block);

//  private:
//   bool isAligned(uintptr_t address) const {
//     return (address & (maxAlign_ - 1)) == 0;
//   }
//   bool isAligned(void* p) const {
//     return isAligned(reinterpret_cast<uintptr_t>(p));
//   }

//   // Round up size so it's properly aligned
//   size_t roundUp(size_t size) const {
//     auto maxAl = maxAlign_ - 1;
//     size_t realSize;
//     if (!checked_add<size_t>(&realSize, size, maxAl)) {
//       throw_exception<std::bad_alloc>();
//     }
//     return realSize & ~maxAl;
//   }

//   // cache_last<true> makes the list keep a pointer to the last element, so we
//   // have push_back() and constant time splice_after()
//   typedef boost::intrusive::slist<
//       Block,
//       boost::intrusive::member_hook<Block, BlockLink, &Block::link>,
//       boost::intrusive::constant_time_size<false>,
//       boost::intrusive::cache_last<true>>
//       BlockList;

//   typedef boost::intrusive::slist<
//       LargeBlock,
//       boost::intrusive::member_hook<LargeBlock, BlockLink, &LargeBlock::link>,
//       boost::intrusive::constant_time_size<false>,
//       boost::intrusive::cache_last<true>>
//       LargeBlockList;

//   void* allocateSlow(size_t size);

//   // Empty member optimization: package Alloc with a non-empty member
//   // in case Alloc is empty (as it is in the case of SysAllocator).
//   struct AllocAndSize : public Alloc {
//     explicit AllocAndSize(const Alloc& a, size_t s)
//         : Alloc(a), minBlockSize(s) {}

//     size_t minBlockSize;
//   };

//   size_t minBlockSize() const { return allocAndSize_.minBlockSize; }
//   Alloc& alloc() { return allocAndSize_; }
//   const Alloc& alloc() const { return allocAndSize_; }

//   AllocAndSize allocAndSize_;
//   BlockList blocks_;
//   typename BlockList::iterator currentBlock_;
//   LargeBlockList largeBlocks_;
//   char* ptr_;
//   char* end_;
//   size_t totalAllocatedSize_;
//   size_t bytesUsed_;
//   const size_t sizeLimit_;
//   const size_t maxAlign_;
// };

// template <class Alloc>
// struct AllocatorHasTrivialDeallocate<Arena<Alloc>> : std::true_type {};

// /**
//  * By default, don't pad the given size.
//  */
// template <class Alloc>
// struct ArenaAllocatorTraits {
//   static size_t goodSize(const Alloc& /* alloc */, size_t size) { return size; }
// };

// template <>
// struct ArenaAllocatorTraits<SysAllocator<char>> {
//   static size_t goodSize(const SysAllocator<char>& /* alloc */, size_t size) {
//     return goodMallocSize(size);
//   }
// };

// /**
//  * Arena that uses the system allocator (malloc / free)
//  */
// class SysArena : public Arena<SysAllocator<char>> {
//  public:
//   explicit SysArena(
//       size_t minBlockSize = kDefaultMinBlockSize,
//       size_t sizeLimit = kNoSizeLimit,
//       size_t maxAlign = kDefaultMaxAlign)
//       : Arena<SysAllocator<char>>({}, minBlockSize, sizeLimit, maxAlign) {}
// };

// template <>
// struct AllocatorHasTrivialDeallocate<SysArena> : std::true_type {};

// template <typename T, typename Alloc>
// using ArenaAllocator = CxxAllocatorAdaptor<T, Arena<Alloc>>;

// template <typename T>
// using SysArenaAllocator = ArenaAllocator<T, SysAllocator<char>>;

// template <typename T, typename Alloc>
// using FallbackArenaAllocator =
//     CxxAllocatorAdaptor<T, Arena<Alloc>, /* FallbackToStdAlloc */ true>;

// template <typename T>
// using FallbackSysArenaAllocator = FallbackArenaAllocator<T, SysAllocator<char>>;

// } // namespace folly

// #include <folly/memory/Arena-inl.h>

import {
  View,
  Text,
  StatusBar,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from '../createAccount/createAccount.styles';
import {MainContext} from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';
import moment from 'moment';
import DismissKeyboardWrapper from '../../components/dismissKeyboard';
const ForgotBackupCode = React.lazy(() => import('./forgotBackUpCode'));
const EventForgotBackupCode = () => {
  const CTX = useContext(MainContext);
  const isFocused = useIsFocused();
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [inputs, setInputs] = useState({});
  const route = useRoute();
  const [topIndex, setIndex] = useState(null);
  const listCate = [{name: 'Personal'}, {name: 'Business'}];
  const [showAbsolute, setShowAbsolute] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['40%', '40%'], []);
  const [account_type, setAccount_type] = useState('Account type');
  const [isNext, setIsNext] = useState(true);

  const showBottomSheetHandler = useCallback(() => {
    setShowAbsolute(true);
    bottomSheetModalRef.current?.present();
  }, []);

  const closeModalPress = useCallback(() => {
    setShowAbsolute(false);
    bottomSheetModalRef.current?.close();
  }, []);

  const onChangeSelected = (index, e) => {
    setIndex(index);
    setAccount_type(listCate[index].name);
    setTimeout(() => {
      closeModalPress();
    }, 500);
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
    }
  }, [isFocused]);

  const sendCodeHandler = async () => {
    if (loading) {
      return null;
    }

    if (
      route?.params?.email?.trim()?.toLowerCase() !==
      inputs?.email?.trim()?.toLowerCase()
    ) {
      setErrMsg('Your email do not match');
      setShowMsg(true);
      return;
    }

    // if (route?.params?.phone?.toLowerCase() !== inputs?.phone?.toLowerCase()) {
    //   setErrMsg('Phone number do not match');
    //   setShowMsg(true);
    //   return;
    // }

    setLoading(true);
    try {
      const fetching = await fetch(
        `${CTX.url}auth/user/account/forgot-backup-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${CTX.token}`,
          },
          body: JSON.stringify({
            username: inputs?.username?.trim()?.toLowerCase(),
            phone: inputs?.phone,
            date: moment().format('lll'),
            email: inputs?.email?.trim()?.toLowerCase(),
          }),
        },
      );
      const parsedJson = await fetching.json();
      setLoading(false);
      if (parsedJson?.e) {
        // console.log('backupParsedJson', parsedJson?.m);
        setErrMsg(parsedJson?.m);
        setShowMsg(true);
        return;
      }
      setErrMsg(parsedJson?.data?.data);
      setShowMsg(true);

      navigation.navigate('FromForgottenBackup', {
        phone: route?.params?.phone,
        email: route?.params?.email,
        show_hint: route?.params?.show_hint,
        username: route?.params?.username,
      });
    } catch (error) {
      setLoading(false);
      // console.log('error verifying backup code => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  // console.log("parsedJson?.m =>> ", showMsg);

  // renders
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  const showNextHandler = () => {
    if (route?.params?.show_hint) {
      // show_hint is true so confirm the write up is the same with the hints
      // if (
      //   inputs?.username?.toLowerCase()?.trim() == route?.params?.username &&
      //   inputs?.phone?.toLowerCase()?.trim() == route?.params?.phone
      // ) {
      setIsNext(true);
      // console.log("inputs?.phone?.toLowerCase()?.trim() =>> ", inputs?.phone?.toLowerCase()?.trim());
      // console.log("route?.params?.phone =>> ", route?.params?.phone);

      // console.log("inputs?.username?.toLowerCase()?.trim() =>> ", inputs?.username?.toLowerCase()?.trim());
      // console.log("route?.params?.username =>> ", route?.params?.username);

      // } else {
      //   setErrMsg('Incorrect username or phone number.');
      //   setShowMsg(true);
      //   return;
      // }
    } else {
      setIsNext(true);
    }
  };

  return (
    <>
      <DismissKeyboardWrapper>
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          translucent={false}
          barStyle={'dark-content'}
        />

        {showAbsolute && (
          <Pressable
            onPress={closeModalPress}
            style={{
              ...styles.showAbsolute,
            }}>
            <BottomSheet
              ref={bottomSheetModalRef}
              index={1}
              backdropComponent={renderBackdrop}
              enablePanDownToClose={true}
              snapPoints={snapPoints}
              handleComponent={() => (
                <View style={styles.handleComponentStyle}>
                  <Text style={{...styles.reactionText, color: '#fff'}}>
                    Account type
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={closeModalPress}
                    style={styles.closeLine}>
                    <Ionicons color={'#838289'} name="close" size={23} />
                  </TouchableOpacity>
                </View>
              )}>
              <BottomSheetView style={{width: '100%', height: '100%'}}>
                <Pressable
                  style={{flex: 1}}
                  onPress={() => {
                    return null;
                  }}>
                  {/* <Text style={{color: 'red'}}> HELLO WORLD HERE </Text> */}
                  <View style={{padding: 20}}>
                    <Text
                      style={{
                        ...styles.categoryText,
                        fontSize: 17,
                        textAlign: 'left',
                      }}>
                      Select account type
                    </Text>

                    {/* map the account type here */}
                    <FlatList
                      style={{marginTop: 20}}
                      data={listCate}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => onChangeSelected(index)}
                          key={index}
                          style={styles.coverUserCommentSection}>
                          <Text style={styles.sortText}>{item.name}</Text>
                          <View
                            style={{
                              ...styles.clickable,
                              backgroundColor:
                                index == topIndex ? '#e20154' : '#fff',
                            }}>
                            <View style={styles.innerCircle}></View>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </Pressable>
              </BottomSheetView>
            </BottomSheet>
          </Pressable>
        )}

        {showMsg && (
          <ErrMessage msg={errMsg} closeErr={() => setShowMsg(false)} />
        )}

        <Suspense fallback={null}>
          <ForgotBackupCode
            navigation={navigation}
            inputs={inputs}
            setInputs={setInputs}
            route={route}
            showBottomSheetHandler={showBottomSheetHandler}
            account_type={account_type}
            sendCodeHandler={sendCodeHandler}
            loading={loading}
            showNextHandler={showNextHandler}
            isNext={isNext}
            setIsNext={setIsNext}
          />
        </Suspense>
      </DismissKeyboardWrapper>
    </>
  );
};

export default EventForgotBackupCode;
