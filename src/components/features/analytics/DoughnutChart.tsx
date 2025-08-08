import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, textStyles, spacing } from '../../../styles';

interface DoughnutChartProps {
  data: Array<{
    name: string;
    population: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }>;
  title?: string;
  height?: number;
  width?: number;
}

const { width: defaultWidth } = Dimensions.get('window');

const DoughnutChart: React.FC<DoughnutChartProps> = ({ 
  data, 
  title = 'Doughnut Chart', 
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
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <PieChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
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
});

export default DoughnutChart; 