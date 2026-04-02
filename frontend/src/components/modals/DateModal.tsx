import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';

/**
 * @interface DateModalProps
 * @property {boolean} visible - モーダルの表示状態
 * @property {string} days - 入力された日数
 * @property {(days: string) => void} setDays - 日数を更新する関数
 * @property {() => void} onConfirm - 決定ボタンが押されたときの処理
 * @property {() => void} onClose - モーダルを閉じる処理
 */
interface DateModalProps {
  visible: boolean;
  days: string;
  setDays: (days: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 消費期限（日数）を手動で入力させるモーダル
 */
export const DateModal: React.FC<DateModalProps> = ({ visible, days, setDays, onConfirm, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-surface-container-lowest p-6 rounded-2xl w-4/5 items-center">
          <Text className="font-headline text-lg font-bold mb-4 text-on-surface">消費期限を設定</Text>
          <Text className="text-sm text-on-surface-variant mb-6 text-center">
            このアイテムにはデフォルトの消費期限が設定されていません。何日持ちますか？
          </Text>
          <TextInput
            className="w-full bg-surface-container-low p-4 rounded-xl mb-6 font-body text-base text-on-surface text-center"
            placeholder="日数 (例: 7)"
            keyboardType="number-pad"
            value={days}
            onChangeText={setDays}
          />
          <TouchableOpacity className="w-full bg-primary py-4 rounded-xl items-center mb-3" onPress={onConfirm}>
            <Text className="text-on-primary font-bold text-base">決定</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full bg-surface-variant py-4 rounded-xl items-center" onPress={onClose}>
            <Text className="text-on-surface-variant font-bold text-base">キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
