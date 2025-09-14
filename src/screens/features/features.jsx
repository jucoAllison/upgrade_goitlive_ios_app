import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useContext, useEffect, useRef} from 'react';
import styles from '../amassCenter/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation, useRoute} from '@react-navigation/native';
import featureImage from '../../assets/features.jpg';
import {MainContext} from '../../../App';

const Features = () => {
  const scrollViewRef = useRef(null);
  const route = useRoute();
  // Get the scroll position passed from ScreenA
  const scrollTo = route?.params?.scrollTo;
  const navigation = useNavigation();
  const CTX = useContext(MainContext);

  const pressHeaderHere = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (scrollTo) {
      // Scroll to the passed position once the component mounts
      scrollViewRef.current?.scrollTo({y: scrollTo, animated: true});
    }
  }, [scrollTo]);

  const scrollToSection = () => {
    scrollViewRef.current?.scrollTo({y: 2020, animated: true}); // y is the vertical offset you want to scroll to
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      ref={scrollViewRef}
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        flex: 1,
      }}>
      <View style={{padding: 20, paddingTop: 16}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{paddingTop: 0, width: 35}}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={{...styles.personalInfo, marginBottom: 8,
          fontFamily: 'Gilroy-Bold'
        }}>GoItLive</Text>
        <Text
          style={{
            ...styles.amassName,
            marginBottom: 18,
            fontSize: 15,
            color: '#555555',
            fontWeight: '300',fontFamily: 'Gilroy-Regular'
          }}>
          Monetize your content and handle all your social media activities in
          one app.
        </Text>
        <Text
          style={{...styles.groupBy, ...styles.bgGroupBy, color: '#555555',
            fontFamily: 'Gilroy-Bold'
          }}>
          Features
        </Text>
      </View>
      <Image source={featureImage} style={styles.featureImage} />

      <View style={{padding: 20, paddingTop: 16}}>
        <Text style={{fontFamily: 'Gilroy-Regular', color: '#555555'}}>
          Our app lets you earn money from your content while seamlessly
          managing everything you do on other social media platforms—all in one
          place. No more switching between apps! Create, share, and interact
          with your followers across multiple platforms effortlessly, while
          unlocking new ways to monetize your content. Plus, your content is
          fully protected with built-in features that prevent screenshotting and
          screen recording, giving you complete control over how your content is
          shared. Simplify your social media experience and turn your passion
          into income, all from a single secure app.
        </Text>

        <Text
          style={{
            ...styles.personalInfo,
            fontSize: 20,
            fontFamily: 'Gilroy-Bold',
          }}>
          Live streaming
        </Text>

        <Text style={{fontFamily: 'Gilroy-Regular', color: '#555555'}}>
          Live Streaming on Our App: Public and Private Options for Engagement
          and Monetization
        </Text>

        <Text
          style={{
            fontFamily: 'Gilroy-Regular',
            color: '#555555',
            marginTop: 10,
          }}>
          Our app offers two distinct types of live streaming experiences—
          <Text style={{fontFamily: 'Gilroy-Bold'}}>
            Public Live Streaming
          </Text>{' '}
          and{' '}
          <Text style={{fontFamily: 'Gilroy-Bold'}}>
            Private Live Streaming
          </Text>
          —each designed to help you connect with your audience while generating
          revenue.
        </Text>

        <Text
          style={{
            fontFamily: 'Gilroy-Regular',
            color: '#555555',
            marginTop: 10,
          }}>
          <Text style={{fontFamily: 'Gilroy-Bold'}}>Public Live Streaming</Text>{' '}
          is open to anyone, anywhere. This live session allows you to reach a
          broad audience, where anyone can join and engage with your content.
          Since public streams are available to the general public, they must
          comply with the app’s community guidelines to ensure a safe and
          respectful environment for all viewers. This option is ideal for users
          looking to grow their audience, host large events, or share content
          with the wider world while earning income as more people join.
        </Text>

        <Text
          style={{
            fontFamily: 'Gilroy-Regular',
            color: '#555555',
            marginTop: 10,
          }}>
          <Text style={{fontFamily: 'Gilroy-Bold'}}>
            Private Live Streaming
          </Text>
          , found within the chat section of the app, offers a more secure and
          personalized live experience. There are two options under private
          streaming:
        </Text>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
            marginLeft: 10,
          }}>
          <Entypo name="dot-single" size={26} color="#000" />
          <Text style={{fontFamily: 'Gilroy-Regular', color: '#555555'}}>
            <Text style={{fontFamily: 'Gilroy-Regular'}}>One-to-One Live</Text>{' '}
            enables you to connect directly with a single viewer, offering an
            exclusive and intimate experience, perfect for personal
            conversations, consultations, or exclusive content delivery.
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
            marginLeft: 10,
          }}>
          <Entypo name="dot-single" size={26} color="#000" />
          <Text
            style={{
              fontFamily: 'Gilroy-Regular',
              color: '#555555',
            }}>
            <Text style={{fontFamily: 'Gilroy-Regular'}}>One-to-Many Live</Text>{' '}
            allows you to engage with multiple viewers in a private setting,
            offering a more controlled and focused environment where you can
            share content with a select audience.
          </Text>
        </View>

        <Text
          style={{
            color: '#555555',
            marginTop: 10,
            fontFamily: 'Gilroy-Regular',
          }}>
          Private live streams are fully encrypted, meaning the content is
          secure and not monitored, giving you and your audience the freedom to
          interact privately. This ensures a higher level of privacy and
          confidentiality for both you and your viewers. While not subject to
          public guidelines, this feature is perfect for those seeking more
          personalized interactions, such as private shows, classes, or intimate
          conversations.
        </Text>

        <Text
          style={{
            color: '#555555',
            marginTop: 10,
            fontFamily: 'Gilroy-Regular',
          }}>
          Regardless of the type of live streaming you choose—public or
          private—each session offers opportunities for revenue generation. As
          viewers join your live streams, whether publicly or privately, you’ll
          earn income based on the size and engagement of your audience.
        </Text>

        <Text
          style={{
            ...styles.personalInfo,
            fontSize: 20,
            marginBottom: 10,
            fontFamily: 'Gilroy-Bold',
          }}
          onPress={scrollToSection}>
          Monetization
        </Text>
        <Text
          style={{
            color: '#555555',
            fontFamily: 'Gilroy-Regular',
          }}>
          The more engaging and interesting your content is on Private Live, the
          more revenue you can generate. By consistently uploading high-quality
          videos and attracting viewers, your account can qualify for
          monetization, allowing you to earn even more from your live sessions
          and content.
        </Text>

        <Text
          style={{
            ...styles.personalInfo,
            fontSize: 20,
            marginBottom: 10,
            fontFamily: 'Gilroy-Bold',
          }}>
          Verification
        </Text>
        <Text
          style={{
            color: '#555555',
            fontFamily: 'Gilroy-Regular',
          }}>
          As you go live more frequently and continue to grow your audience,
          your account can become eligible for verification. By reaching a
          larger online community and maintaining an active presence, you can
          get your account verified, increasing your credibility and visibility
          on the platform.
        </Text>
        <Text
          style={{
            fontFamily: 'satoshiblack',
            color: '#555555',
            marginTop: 10,
            fontFamily: 'Gilroy-Bold',
          }}>
          Additional Info:
        </Text>
        <Text
          style={{
            color: '#555555',
            fontFamily: 'Gilroy-Regular',
          }}>
          Monetization and verification are key milestones that reward your
          growth and success on the app. As you attract more viewers and engage
          with your audience, you unlock new opportunities to earn money and
          boost your status. Whether it’s through captivating live streams or
          building a strong cares, your consistent efforts can lead to
          recognition, financial rewards, and enhanced influence on the
          platform.
        </Text>

        <Text
          style={{
            ...styles.personalInfo,
            fontSize: 20,
            fontFamily: 'Gilroy-Bold',
          }}>
          Amass{' '}
          <Text style={{fontFamily: 'Gilroy-Regular', fontSize: 12}}>
            (coming soon)
          </Text>{' '}
        </Text>

        <Text
          style={{
            color: '#555555',
            fontFamily: 'Gilroy-Regular',
          }}>
          Introducing Amass: a unique space within the app designed for
          like-minded individuals to come together and share their experiences
          through pictures. In Amass, users can create or join groups based on
          shared interests or passions, allowing for a more focused and
          interactive social experience. Members can post pictures, like, and
          comment on each other’s content, fostering a sense of community and
          engagement. However, there’s a twist—each post within Amass is
          temporary and self-destructs after 4 days, ensuring that the focus
          remains on fresh, in-the-moment content. This adds an element of
          excitement and exclusivity, as users know their shared moments are
          fleeting and can’t be captured or saved forever. It’s all about living
          in the moment, sharing memories, and engaging with others before the
          content disappears.
        </Text>

        <Text
          style={{
            color: '#555555',
            marginTop: 10,
            fontFamily: 'Gilroy-Regular',
          }}>
          Hi {CTX.userObj.username}, Any user can create their own Amass, but
          with a special rule: one account, one Amass. This feature allows each
          user to build and manage their own unique community, fostering deeper
          engagement and interaction with their audience. Amass is not just a
          group—it’s a personal space where users can bring together people who
          share similar interests, creating a sense of belonging and
          exclusivity. As the creator, you have full control over your Amass,
          cultivating an environment that aligns with your passions or goals.
          Whether you're a content creator, hobbyist, or just looking to connect
          with others, Amass gives you the opportunity to build a thriving
          community where engagement is key. By sharing posts, interacting with
          others, and driving meaningful conversations, you create a more active
          and engaged following.
        </Text>

        <Text
          style={{
            ...styles.personalInfo,
            fontSize: 20,
            fontFamily: 'Gilroy-Bold',
          }}>
          ✨ GoitLive is still in Beta!
        </Text>

        <Text
          style={{
            color: '#555555',
            fontFamily: 'Gilroy-Regular',
          }}>
          That means we’re actively building, testing, and improving things
          behind the scenes. During this stage, features may change, get
          updated, or even be removed as we figure out what works best.
        </Text>
        <Text
          style={{
            color: '#555555',
            marginTop: 10,
            fontFamily: 'Gilroy-Regular',
          }}>
          So don’t be surprised if something looks a little different
          tomorrow—we’re moving fast! 🚀
        </Text>
        <Text
          style={{
            color: '#555555',
            marginTop: 10,
            fontFamily: 'Gilroy-Regular',
          }}>
          Your feedback is super valuable, and it helps us make GoitLive even
          better.
        </Text>
        <Text
          style={{
            color: '#555555',
            marginTop: 10,
            fontFamily: 'Gilroy-Regular',
          }}>
          Thanks for being part of the journey ❤️
        </Text>
      </View>
    </ScrollView>
  );
};

export default Features;
