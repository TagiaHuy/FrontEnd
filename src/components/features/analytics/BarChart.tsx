import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { colors, textStyles, spacing } from '../../../styles';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
    }>;
  };
  title?: string;
  height?: number;
  width?: number;
}

const { width: defaultWidth } = Dimensions.get('window');

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title = 'Bar Chart', 
  height = 220,
  width = defaultWidth
}) => {
  const chartConfig = {
    backgroundColor: colors.background.primary,
    backgroundGradientFrom: colors.background.primary,
    backgroundGradientTo: colors.background.primary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNBarChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero={true}
        showBarTops={true}
        showValuesOnTopOfBars={true}
        yAxisLabel=""
        yAxisSuffix=""
      />
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

export default BarChart; 