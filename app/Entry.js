/* eslint-disable react/display-name */
import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import { NavigationContainer } from '@react-navigation/native';
import {
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import SettingsScreen from './views/Settings';
import AboutScreen from './views/About';
import PartnersOverviewScreen from './views/Partners/PartnersOverview';
import PartnersEditScreen from './views/Partners/PartnersEdit';
import PartnersCustomUrlScreen from './views/Partners/PartnersCustomUrlScreen';

import { LicensesScreen } from './views/Licenses';
import { ExportSelectHA, ExportStart, ExportLocally } from './gps/Export';
import ExportStack from './bt/AffectedUserFlow';

import NotificationPermissionsBT from './bt/NotificationPermissionsBT';
import ExposureHistoryScreen from './views/ExposureHistory';
import Assessment from './views/assessment';
import NextSteps from './views/ExposureHistory/NextSteps';
import MoreInfo from './views/ExposureHistory/MoreInfo';
import ENDebugMenu from './views/Settings/ENDebugMenu';
import ImportFromUrl from './views/Settings/ImportFromUrl';
import { ENLocalDiagnosisKeyScreen } from './views/Settings/ENLocalDiagnosisKeyScreen';
import { ExposureListDebugScreen } from './views/Settings/ExposureListDebugScreen';
import { FeatureFlagsScreen } from './views/FeatureFlagToggles';
import ImportScreen from './views/Import';
import { EnableExposureNotifications } from './views/onboarding/EnableExposureNotifications';
import Welcome from './views/onboarding/Welcome';
import PersonalPrivacy from './views/onboarding/PersonalPrivacy';
import NotificationDetails from './views/onboarding/NotificationDetails';
import ShareDiagnosis from './views/onboarding/ShareDiagnosis';
import NotificationsPermissions from './views/onboarding/NotificationsPermissions';
import LocationsPermissions from './views/onboarding/LocationsPermissions';
import LanguageSelection from './views/LanguageSelection';

import { Screens, Stacks } from './navigation';

import ExposureHistoryContext from './ExposureHistoryContext';
import isOnboardingCompleteSelector from './store/selectors/isOnboardingCompleteSelector';
import { isGPS } from './COVIDSafePathsConfig';
import { useTracingStrategyContext } from './TracingStrategyContext';

import * as Icons from './assets/svgs/TabBarNav';
import { Layout, Affordances, Colors } from './styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const fade = ({ current }) => ({ cardStyle: { opacity: current.progress } });

const SCREEN_OPTIONS = {
  headerShown: false,
};

const ExposureHistoryStack = ({ navigation }) => {
  const { observeExposures } = useContext(ExposureHistoryContext);
  useEffect(() => {
    const unsubscribeTabPress = navigation.addListener('tabPress', () => {
      observeExposures();
    });
    return unsubscribeTabPress;
  }, [navigation, observeExposures]);

  return (
    <Stack.Navigator
      mode='modal'
      screenOptions={{
        ...SCREEN_OPTIONS,
      }}>
      <Stack.Screen
        name={Screens.ExposureHistory}
        component={ExposureHistoryScreen}
      />
      <Stack.Screen name={Screens.NextSteps} component={NextSteps} />
      <Stack.Screen name={Screens.MoreInfo} component={MoreInfo} />
    </Stack.Navigator>
  );
};

const SelfAssessmentStack = () => (
  <Stack.Navigator
    mode='modal'
    screenOptions={{
      ...SCREEN_OPTIONS,
      cardStyleInterpolator: fade,
      gestureEnabled: false,
    }}>
    <Stack.Screen name={Screens.SelfAssessment} component={Assessment} />
  </Stack.Navigator>
);

const MoreTabStack = () => {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name={Screens.Settings} component={SettingsScreen} />
      <Stack.Screen name={Screens.About} component={AboutScreen} />
      <Stack.Screen name={Screens.Licenses} component={LicensesScreen} />
      <Stack.Screen
        name={Screens.FeatureFlags}
        component={FeatureFlagsScreen}
      />
      <Stack.Screen name={Screens.Import} component={ImportScreen} />
      <Stack.Screen name={Screens.ImportFromUrl} component={ImportFromUrl} />
      <Stack.Screen name={Screens.ENDebugMenu} component={ENDebugMenu} />
      <Stack.Screen
        name={Screens.LanguageSelection}
        component={LanguageSelection}
      />
      <Stack.Screen
        name={Screens.ExportFlow}
        component={ExportStack}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={Screens.ExposureListDebugScreen}
        component={ExposureListDebugScreen}
      />
      <Stack.Screen
        name={Screens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKeyScreen}
      />
      {isGPS ? (
        <Stack.Screen name={Screens.ExportLocally} component={ExportLocally} />
      ) : null}
    </Stack.Navigator>
  );
};

const screensWithNoTabBar = [Screens.ExportSelectHA, Screens.ExportFlow];

const determineTabBarVisibility = (route) => {
  const routeName = route.state?.routes[route.state.index].name;
  return !screensWithNoTabBar.includes(routeName);
};

const GPSExportStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Screens.ExportStart}
        component={ExportStart}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Screens.ExportSelectHA}
        component={ExportSelectHA}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

const MainAppTabs = () => {
  const { t } = useTranslation();
  const { userHasNewExposure } = useContext(ExposureHistoryContext);
  const { homeScreenComponent } = useTracingStrategyContext();

  const applyBadge = (icon) => {
    return (
      <>
        {icon}
        <View style={styles.iconBadge} />
      </>
    );
  };

  const styles = StyleSheet.create({
    iconBadge: {
      ...Affordances.iconBadge,
    },
  });

  return (
    <Tab.Navigator
      initialRouteName={Stacks.Main}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: Colors.white,
        inactiveTintColor: Colors.primaryViolet,
        style: {
          backgroundColor: Colors.navBar,
          borderTopColor: Colors.navBar,
          height: Layout.navBar,
        },
      }}>
      <Tab.Screen
        name={Stacks.Main}
        component={homeScreenComponent}
        options={{
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ focused, size }) => (
            <SvgXml
              xml={focused ? Icons.HomeActive : Icons.HomeInactive}
              accessible
              accessibilityLabel={t('label.home_icon')}
              width={size}
              height={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Stacks.ExposureHistory}
        component={ExposureHistoryStack}
        options={{
          tabBarLabel: t('navigation.history'),
          tabBarIcon: ({ focused, size }) => {
            const tabIcon = (
              <SvgXml
                xml={focused ? Icons.CalendarActive : Icons.CalendarInactive}
                accessible
                accessibilityLabel={t('label.calendar_icon')}
                width={size}
                height={size}
              />
            );

            return !isGPS && userHasNewExposure ? applyBadge(tabIcon) : tabIcon;
          },
        }}
      />
      {isGPS && (
        <Tab.Screen
          name={'Export Start'}
          component={GPSExportStack}
          options={({ route }) => ({
            tabBarVisible: determineTabBarVisibility(route),
            tabBarLabel: t('navigation.locations'),
            tabBarIcon: ({ focused, size }) => (
              <SvgXml
                xml={focused ? Icons.LocationsActive : Icons.LocationsInactive}
                accessible
                accessibilityLabel={t('label.pin_icon')}
                width={size}
                height={size}
              />
            ),
          })}
        />
      )}
      {isGPS ? (
        <Tab.Screen
          name={Stacks.Partners}
          component={PartnersStack}
          options={{
            tabBarLabel: t('navigation.partners'),
            tabBarIcon: ({ focused, size }) => (
              <SvgXml
                xml={focused ? Icons.ShieldActive : Icons.ShieldInactive}
                accessible
                accessibilityLabel={t('label.shield_icon')}
                width={size}
                height={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name={Stacks.SelfAssessment}
          component={SelfAssessmentStack}
          options={{
            tabBarLabel: t('navigation.self_assessment'),
            tabBarIcon: ({ focused, size }) => (
              <SvgXml
                xml={
                  focused
                    ? Icons.SelfAssessmentActive
                    : Icons.SelfAssessmentInactive
                }
                accessible
                accessibilityLabel={t('label.assessment_icon')}
                width={size}
                height={size}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name={Stacks.More}
        component={MoreTabStack}
        options={({ route }) => ({
          tabBarVisible: determineTabBarVisibility(route),
          tabBarLabel: t('navigation.more'),
          tabBarIcon: ({ focused, size }) => (
            <SvgXml
              xml={focused ? Icons.MoreActive : Icons.MoreInactive}
              accessible
              accessibilityLabel={t('label.more_icon')}
              width={size}
              height={size}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name={Screens.Welcome} component={Welcome} />
    <Stack.Screen name={Screens.PersonalPrivacy} component={PersonalPrivacy} />
    <Stack.Screen
      name={Screens.NotificationDetails}
      component={NotificationDetails}
    />
    <Stack.Screen name={Screens.ShareDiagnosis} component={ShareDiagnosis} />
    <Stack.Screen
      name={Screens.OnboardingNotificationPermissions}
      component={NotificationsPermissions}
    />
    <Stack.Screen
      name={Screens.OnboardingLocationPermissions}
      component={LocationsPermissions}
    />
    <Stack.Screen
      name={Screens.NotificationPermissionsBT}
      component={NotificationPermissionsBT}
    />
    <Stack.Screen
      name={Screens.EnableExposureNotifications}
      component={EnableExposureNotifications}
    />
  </Stack.Navigator>
);

const PartnersStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen
      name={Screens.PartnersOverview}
      component={PartnersOverviewScreen}
    />
    <Stack.Screen name={Screens.PartnersEdit} component={PartnersEditScreen} />
    <Stack.Screen
      name={Screens.PartnersCustomUrl}
      component={PartnersCustomUrlScreen}
    />
  </Stack.Navigator>
);

export const Entry = () => {
  const onboardingComplete = useSelector(isOnboardingCompleteSelector);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        {onboardingComplete ? (
          <Stack.Screen name={'App'} component={MainAppTabs} />
        ) : (
          <Stack.Screen name={Stacks.Onboarding} component={OnboardingStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
