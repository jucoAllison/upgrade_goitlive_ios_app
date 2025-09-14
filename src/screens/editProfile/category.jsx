import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import React, {memo, useCallback, useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styles from './editProfile.styles';
import {MainContext} from '../../../App';

const Category = ({closeBottomSheet, sendToServer}) => {
  const CTX = useContext(MainContext);
  const [listCate, setListCate] = useState([]);

  const listData = [
    {name: 'Artist'},
    {name: 'Musician/band'},
    {name: 'Blogger'},
    {name: 'Clothing(Brand)'},
    {name: 'Developer'},
    {name: 'Digital creator'},
    {name: 'Baby Goods/Kids Goods'},
    {name: 'Bar'},
    {name: 'Beauty, Cosmetic & Personal Care'},
    {name: 'Beauty Salon'},
    {name: 'Education'},
    {name: 'Entrepreneur'},
    {name: 'Advertising/Marketing'},
    {name: 'Album'},
    {name: 'Amateur Sports Team'},
    {name: 'Apartment & Condo Building'},
    {name: 'Appliance Repair Service'},
    {name: 'App Page'},
    {name: 'Architectural Designer'},
    {name: 'Art'},
    {name: 'Artist'},
    {name: 'Arts & Entertainment'},
    {name: 'Automotive Repair Shop'},
    {name: 'Baby & Children’s Clothing Store'},
    {name: 'Book'},
    {name: 'Commercial & Industrial'},
    {name: 'Commercial & Industrial Equipment Supplier'},
    {name: 'Commercial BankCommercial Bank'},
    {name: 'Commercial Equipment'},
    {name: 'Commercial Real Estate Agency'},
    {name: 'Church of Jesus Christ of Latter-day Saints'},
    {name: 'Clothing (Brand)'},
    {name: 'Clothing Store'},
    {name: 'College & University'},
    {name: 'Contractor'},
    {name: 'Convenience Store'},
    {name: 'Commercial Truck Dealership'},
    {name: 'Community'},
    {name: 'Community Organization'},
    {name: 'Consulting Agency'},
    {name: 'Business Center'},
    {name: 'Credit Union'},
    {name: 'Doctor'},
    {name: 'Deli'},
    {name: 'Dancer'},
    {name: 'Design & Fashion'},
    {name: 'Dessert Shop'},
    {name: 'Discount Store'},
    {name: 'Dorm'},
    {name: 'E-Cigarette Store'},
    {name: 'E-commerce Website'},
    {name: 'Education'},
    {name: 'Engineering Service'},
    {name: 'Entertainment Website'},
    {name: 'Entrepreneur'},
    {name: 'Episode'},
    {name: 'Business Service'},
    {name: 'Camera/Photo'},
    {name: 'Canoe & Kayak Rental'},
    {name: 'Chicken Joint'},
    {name: 'Church of Christ'},
    {name: 'Event'},
    {name: 'Family Style Restaurant'},
    {name: 'Fashion Designer'},
    {name: 'Fashion Model'},
    {name: 'Fast Food Restaurant'},
    {name: 'Financial Service'},
    {name: 'Food & Beverage'},
    {name: 'Industrial Company'},
    {name: 'Local Service'},
    {name: 'Lumber Yard'},
    {name: 'Marketing Agency'},
    {name: 'Media'},
    {name: 'Media/News Company'},
    {name: 'Medical Center'},
    {name: 'Medical School'},
    {name: 'Men’s Clothing Store'},
    {name: 'Mental Health Service'},
    {name: 'Food Stand'},
    {name: 'Footwear Store'},
    {name: 'Gamer'},
    {name: 'Games/Toys'},
    {name: 'Government Organization'},
    {name: 'Graphic Designer'},
    {name: 'Grocery Store'},
    {name: 'Hardware Store'},
    {name: 'Health/Beauty'},
    {name: 'Heating, Ventilating & Air Conditioning Service'},
    {name: 'Home Decor'},
    {name: 'Home Improvement'},
    {name: 'Hospital'},
    {name: 'Hotel'},
    {name: 'Hotel & Lodging'},
    {name: 'Ice Cream Shop'},
    {name: 'In-Home Service'},
    {name: 'Movie'},
    {name: 'Musician/Band'},
    {name: 'Music Lessons & Instruction School'},
    {name: 'Music Video'},
    {name: 'News & Media Website'},
    {name: 'Newspaper'},
    {name: 'Nonprofit Organization'},
    {name: 'Non-Governmental Organization (NGO)'},
    {name: 'Information Technology Company'},
    {name: 'Insurance Company'},
    {name: 'Interior Design Studio'},
    {name: 'Internet Company'},
    {name: 'Internet Marketing Service'},
    {name: 'Jazz & Blues Club'},
    {name: 'Japanese Restaurant'},
    {name: 'Jewelry/Watches'},
    {name: 'Journalist'},
    {name: 'Just For Fun'},
    {name: 'Karaoke'},
    {name: 'Kennel'},
    {name: 'Kitchen & Bath Contractor'},
    {name: 'Kitchen/Cooking'},
    {name: 'Korean Restaurant'},
    {name: 'Optician'},
    {name: 'Outdoor & Sporting Goods Company'},
    {name: 'Petting Zoo'},
    {name: 'Photographer'},
    {name: 'Product/Service'},
    {name: 'Public & Government Service'},
    {name: 'Nursing Agency'},
    {name: 'Obstetrician-Gynecologist (OBGYN)'},
    {name: 'Office Equipment Store'},
    {name: 'Office Supplies'},
    {name: 'Science, Technology & Engineering'},
    {name: 'Shopping & Retail'},
    {name: 'Public Figure'},
    {name: 'Public Utility Company'},
    {name: 'Quay'},
    {name: 'Real Estate'},
    {name: 'Real Estate Agent'},
    {name: 'Real Estate Appraiser'},
    {name: 'Real Estate Company'},
    {name: 'Record Label'},
    {name: 'Religious Center'},
    {name: 'Religious Organization'},
    {name: 'TV Show'},
    {name: 'Udon Restaurant'},
    {name: 'Ukranian Restaurant'},
    {name: 'Unagi Restaurant'},
    {name: 'Uniform Supplier'},
    {name: 'Urban Farm'},
    {name: 'Vacation Home Rental'},
    {name: 'Veterinarian'},
    {name: 'Retail Bank'},
    {name: 'School'},
    {name: 'Landmark & Historical Place'},
    {name: 'Lawyer & Law Firm'},
    {name: 'Library'},
    {name: 'Loan Service'},
    {name: 'Not a Business'},
    {name: 'Shopping District'},
    {name: 'Shopping Mall'},
    {name: 'Smoothie & Juice Bar'},
    {name: 'Smoothie & Juice Bar'},
    {name: 'Song'},
    {name: 'Specialty School'},
    {name: 'Traffic School'},
    {name: 'Tutor/Teacher'},
    {name: 'TV Channel'},
    {name: 'TV Network'},
    {name: 'Wedding Planning Service'},
    {name: 'Winery/Vineyard'},
    {name: 'Women’s Clothing Store'},
    {name: 'Women’s Health Clinic'},
    {name: 'Writer'},
    {name: 'Xinjiang Restaurant'},
    {name: 'Yakiniku Restaurant'},
    {name: 'Yakitori Restaurant'},
    {name: 'Yoga Studio'},
    {name: 'Yoshoku Restaurant'},
    {name: 'Youth Organization'},
    {name: 'Video Creator'},
    {name: 'Sports & Recreation'},
    {name: 'Sports League'},
    {name: 'Sports Team'},
    {name: 'Teens & Kids Website'},
    {name: 'Telemarketing Service'},
    {name: 'Tire Dealer & Repair Shop'},
    {name: 'Trade School'},
    {name: 'Video Game'},
    {name: 'Visual Arts'},
    {name: 'Web Designer'},
    {name: 'Developer'},
    {name: 'Software'},
    {name: 'Website'},
    {name: 'Residence'},
    {name: 'Restaurant'},
    {name: 'Zhejiang Restaurant'},
    {name: 'Zoo'},
  ];
  const [truth, setTruth] = useState(false);
  const [topIndex, setIndex] = useState(null);
  const [searchDetails, setSearchDetails] = useState('');

  const onChangeSelected = async (index, e) => {
    // console.log('HELLO FROM HERE OO => ');
    console.log('HELLO FROM HERE OO => ', index);
    setIndex(index);

    setTimeout(() => {
      sendToServer(index);
      closeBottomSheet();
    }, 700);
  };

  // useEffect(() => {
  //   if (searchDetails) {
  //     const filtered = listData.filter(v =>
  //       v.name.toLocaleLowerCase().includes(searchDetails.toLowerCase()),
  //     );
  //     setListCate(filtered);
  //   } else {
  //     setListCate(listData);
  //   }
  // }, [searchDetails]);

  // render
  const renderItem = useCallback(
    (item, index) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChangeSelected(item)}
        key={index}
        style={{
          ...styles.coverUserCommentSection,
        }}>
        <Text style={styles.sortText}>{item.name}</Text>
        <View
          style={{
            ...styles.clickable,
            backgroundColor: topIndex?.name == item.name ? 'blue' : '#fff',
          }}>
          <View style={styles.innerCircle}></View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  const mappedData = listData
    .filter(v =>
      v.name.toLocaleLowerCase().includes(searchDetails.toLowerCase()),
    )
    .map(renderItem);

  return (
    <BottomSheetScrollView
      style={{marginTop: 20}}
      // style={{width: 400, height: 400, backgroundColor: 'red'}}
      contentContainerStyle={
        {
          // ...styles.contentContainer,
          // width: 400,
          // height: 400,
        }
      }>
      <View>
        <Text style={styles.categoryText}>What best describes you?</Text>
        <Text style={styles.subCategoryText}>
          Categories help people find account like yours, you can change these
          anytime
        </Text>

        <View style={{padding: 20}}>
          <View style={{...styles.coverSearchHere, overflow: 'hidden'}}>
            <AntDesign name="search1" color="#262626" size={24} />
            <TextInput
              style={{...styles.mainText, fontSize: 16, width: '100%'}}
              value={searchDetails}
              onChangeText={setSearchDetails}
              placeholder="Search"
              placeholderTextColor={'#262626'}
            />
          </View>

          <Text
            style={{...styles.categoryText, fontSize: 17, textAlign: 'left'}}>
            Suggested
          </Text>

          {/* map the categories here */}
          {/* <FlatList
            style={{marginTop: 20}}
            data={listData}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableOpacity activeOpacity={0.8}
                onPress={() => onChangeSelected(index)}
                key={index}
                style={{
                  ...styles.coverUserCommentSection,
                }}>
                <Text style={styles.sortText}>{item.name}</Text>
                <View
                  style={{
                    ...styles.clickable,
                    backgroundColor: index == topIndex ? 'blue' : '#fff',
                    // backgroundColor:  '#fff',
                  }}>
                  <View style={styles.innerCircle}></View>
                </View>
              </TouchableOpacity>
            )}
          /> */}

          <Pressable
            onPress={() => {
              return null;
            }}>
            {mappedData.length > 0 ? (
              mappedData
            ) : (
              <View style={{marginTop: 60, ...styles.activiityCover}}>
                <FontAwesome5 size={40} color="#262626" name="holly-berry" />
                <Text style={styles.pleaseRetry}>No record found</Text>
              </View>
            )}
          </Pressable>
          <View style={{width: 60, height: 20}}></View>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

export default memo(Category);
