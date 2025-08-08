import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { colors, textStyles, spacing } from '../../../styles';
const chartWidth = Dimensions.get('window').width;

interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
    }>;
  };
  title?: string;
  height?: number;
  width?: number;
  marginLeft?: number;
}

const { width: defaultWidth } = Dimensions.get('window');

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title = 'Weekly Progress', 
  height = 220,
  width = chartWidth,
  marginLeft = 0,
}) => {
  const chartConfig = {
    backgroundColor: colors.background.primary,
    backgroundGradientFrom: colors.background.primary,
    backgroundGradientTo: colors.background.primary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Primary blue color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary.main,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // Solid lines
      stroke: colors.neutral.gray200,
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={{marginLeft: -45}}>
      <RNLineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    alignItems: 'flex-start',
  },
  title: {
    ...textStyles.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'left',
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
    alignSelf: 'stretch',
    marginHorizontal: 0,
  },
});

export default LineChart; 