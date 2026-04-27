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
 * @property {(id: string, priority: string) => void} [onChangePriority] - 優先度を変更する処理
 * @property {(id: string) => void} [onDelete] - リストから削除する処理
 */
interface ActionModalProps {
  visible: boolean;
  item: ShoppingItem | null;
  onClose: () => void;
  onMoveToFridge: () => void;
  onToggleCheck: () => void;
  onChangePriority?: (id: string, priority: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * アイテム長押し時のアクション（冷蔵庫へ移動・チェック・優先度変更・削除）を選択するモーダル
 */
export const ActionModal: React.FC<ActionModalProps> = ({ visible, item, onClose, onMoveToFridge, onToggleCheck, onChangePriority, onDelete }) => {
  if (!item) return null;

  const priorities = ["high", "high", "medium", "low"];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-surface-container-lowest p-6 rounded-2xl w-4/5 items-center">
          <Text className="font-headline text-lg font-bold mb-6 text-center text-on-surface">
            {item.template.name} のアクション
          </Text>
          {item.status === 'checked' ? (
            <TouchableOpacity className="w-full bg-primary py-4 rounded-xl items-center mb-3" onPress={onMoveToFridge}>
              <Text className="text-on-primary font-bold text-base">冷蔵庫 / 食糧庫に入れる</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity className="w-full bg-tertiary-container py-4 rounded-xl items-center mb-3" onPress={onToggleCheck}>
                <Text className="text-on-tertiary-container font-bold text-base">チェックをつける</Text>
              </TouchableOpacity>

              {onChangePriority && (
                <View className="w-full mb-3">
                  <Text className="text-xs font-bold text-outline-variant mb-2 ml-1">優先度の変更</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {priorities.map(p => (
                      <TouchableOpacity
                        key={p}
                        className={`px-3 py-2 rounded-lg border ${item.priority === p ? 'bg-primary-container border-primary-container' : 'bg-surface border-outline-variant'}`}
                        onPress={() => onChangePriority(item.id, p)}
                      >
                        <Text className={`text-xs font-bold ${item.priority === p ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {onDelete && (
                <TouchableOpacity className="w-full bg-error-container py-4 rounded-xl items-center mb-3" onPress={() => onDelete(item.id)}>
                  <Text className="text-on-error-container font-bold text-base">リストから削除する</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          <TouchableOpacity className="w-full bg-surface-variant py-4 rounded-xl items-center" onPress={onClose}>
            <Text className="text-on-surface-variant font-bold text-base">キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
