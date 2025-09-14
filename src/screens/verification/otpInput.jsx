import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

const OtpInput = ({ value, setValue, setFilled }) => {
      const CELL_COUNT = 4;
    
//   const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (value?.length === CELL_COUNT) {
      setFilled(true);
    } else {
      setFilled(false);
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="default"
        textContentType="oneTimeCode"
        autoFocus
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
            style={[
              styles.cell,
              isFocused && styles.focusCell,
            ]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  label: {
    marginBottom: 12,
    fontSize: 16,
  },
  codeFieldRoot: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 50,
    backgroundColor: "#fff",
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusCell: {
    borderColor: '#3CB371',
  },
  cellText: {
    fontSize: 24,
    color: "#000",
    textTransform: 'uppercase',
  },
});

export default OtpInput