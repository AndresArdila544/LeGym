import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

const SelectionInput = ({ options = [], borderColor, height, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (value) => {
    setSelectedValue(value);
    if (onValueChange) onValueChange(value);
  };

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={handleChange}
        placeholder={{ label: "Select an option", value: null }}
        items={options}
        style={pickerSelectStyles}
        value={selectedValue}
        darkTheme={true}
        Icon={() => (
          <Ionicons
            name="chevron-down-outline"
            size={24}
            style={{ marginRight: 10, marginTop: 10 }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 6,
    color: "#444444",
    paddingRight: 30,
    alignItems: 'center',
    height: 50
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 6,
    color: "#444444",
    paddingRight: 30,
    height: 50
  },
});

export default SelectionInput;
