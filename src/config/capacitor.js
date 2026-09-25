import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const initCapacitor = async () => {
  // Chỉ chạy trên nền tảng Native (Android/iOS)
  if (Capacitor.isNativePlatform()) {
    try {
      // Đổi màu chữ thanh trạng thái (Status Bar) thành màu tối để dễ nhìn trên nền sáng
      await StatusBar.setStyle({ style: Style.Dark });

      // Ẩn Splash Screen sau khi app đã load xong giao diện React
      await SplashScreen.hide();

      // Bắt sự kiện nút Back cứng trên Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          // Nếu không còn trang nào để quay lại, thì thoát app
          App.exitApp();
        } else {
          // Ngược lại thì quay lại trang trước
          window.history.back();
        }
      });
      
      console.log('Capacitor plugins initialized successfully');
    } catch (error) {
      console.error('Lỗi khởi tạo Capacitor plugins:', error);
    }
  }
};
