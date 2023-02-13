import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
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
