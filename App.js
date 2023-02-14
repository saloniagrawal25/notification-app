import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Platform, StyleSheet, Text, View } from 'react-native';
import * as Notifications from "expo-notifications";
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true
    }
  },
  handleSuccess: () => { },
  handleError: () => { }
});

export default function App() {

  useEffect(() => {

    async function configurePushNotifications() {
      const { status } = Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        Alert.alert("Permissions required", "Push notifications need apt permissions")
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
    }

    configurePushNotifications()

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT
      })
    }
  }, [])

  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: "",//need to configure
        title: "Test - sent from a device",
        body: "This is a Test Notification"

      })
    })
  }

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log(notification, "notification received")
      const userName = notification.request.content.data.userName;
      console.log(userName);
    })
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("response", response);
      const userName = response.notification.request.content.data.userName;
      console.log(userName);
    })
    return () => {
      subscription.remove();
      responseSubscription.remove()
    }
  }, [])


  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification", body: "This is the body of the notification",
        data: { userName: "Max" }
      },
      trigger: {
        seconds: 2
      }
    })
  }

  return (
    <View style={styles.container}>
      <Button title={"Schedule Notification"} onPress={scheduleNotificationHandler} />
      <Button title={"Send Push Notification"} onPress={sendPushNotificationHandler} />
      <Text>Hello world!!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
