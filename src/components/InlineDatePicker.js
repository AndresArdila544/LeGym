import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';

const CustomInlineDatePicker = ({value,onDateChange}) => {
  const [date, setDate] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (selectedDate) => {
    const formatted = selectedDate.toISOString().split('T')[0]; // yyyy-mm-dd
    setDate(formatted);
    if (onDateChange) onDateChange(formatted);
    hidePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder="Select Date"
          editable={false}
          placeholderTextColor="#444444"
        />
        <TouchableOpacity onPress={showPicker}>
          <Ionicons name="calendar-outline" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // margin: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    height: 50,
    
  },
  input: {
    flex: 1,
    color: '#000',
  },
});

export default CustomInlineDatePicker;
