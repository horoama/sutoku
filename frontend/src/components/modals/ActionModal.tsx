import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { ShoppingItem } from '../../store/shoppingStore';

/**
 * @interface ActionModalProps
 * @property {boolean} visible - モーダルの表示状態
 * @property {ShoppingItem | null} item - 選択されたアイテム
 * @property {() => void} onClose - モーダルを閉じる処理
 * @property {() => void} onMoveToFridge - 冷蔵庫へ移動する処理
 * @property {() => void} onToggleCheck - チェック状態を切り替える処理
 */
interface ActionModalProps {
  visible: boolean;
  item: ShoppingItem | null;
  onClose: () => void;
  onMoveToFridge: () => void;
  onToggleCheck: () => void;
}

/**
 * アイテム長押し時のアクション（冷蔵庫へ移動・チェック）を選択するモーダル
 */
export const ActionModal: React.FC<ActionModalProps> = ({ visible, item, onClose, onMoveToFridge, onToggleCheck }) => {
  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-surface-container-lowest p-6 rounded-2xl w-4/5 items-center">
          <Text className="font-headline text-lg font-bold mb-6 text-center text-on-surface">
            {item.itemTemplate.name} のアクション
          </Text>
          {item.status === 'BOUGHT' ? (
            <TouchableOpacity className="w-full bg-primary py-4 rounded-xl items-center mb-3" onPress={onMoveToFridge}>
              <Text className="text-on-primary font-bold text-base">冷蔵庫 / 食糧庫に入れる</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="w-full bg-tertiary-container py-4 rounded-xl items-center mb-3" onPress={onToggleCheck}>
              <Text className="text-on-tertiary-container font-bold text-base">チェックをつける</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity className="w-full bg-surface-variant py-4 rounded-xl items-center" onPress={onClose}>
            <Text className="text-on-surface-variant font-bold text-base">キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
