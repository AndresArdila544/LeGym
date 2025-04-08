import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const formatDate = (d) => d.toISOString().split('T')[0];

const WorkoutChart = ({ workouts = [], selectedPeriod = '1 month' }) => {
  
  const chartData = useMemo(() => {
    const now = new Date();
    try {
      let labels = [];
      let data = [];

      if (selectedPeriod === '1 week' || selectedPeriod === '1 month') {
        const days = selectedPeriod === '1 week' ? 7 : 30;
        const dateMap = {};

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          const key = formatDate(date);
          labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
          dateMap[key] = 0;
        }

        workouts.forEach(w => {
          const d = formatDate(new Date(w.date));
          if (dateMap[d] !== undefined) {
            dateMap[d]++;
          }
        });

        data = Object.values(dateMap);

        const allSame = new Set(data).size === 1;
        if (allSame && data[0] !== 0) {
          data.push(data[0] + 0.001); // Invisible nudge to fix axis glitch
        }

      } else {
        // 3 months or 1 year: weekly buckets
        const weeks = selectedPeriod === '3 months' ? 12 : 52;
        const weekMap = Array(weeks).fill(0);
        const labelsArray = [];
      
        for (let i = weeks - 1; i >= 0; i--) {
          const start = new Date(now);
          start.setDate(start.getDate() - i * 7);
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
      
          const format = (date) => `${date.getDate()}/${date.getMonth() + 1}`;
          labelsArray.push(`${format(start)}`);
        }
      
        workouts.forEach(w => {
          const workoutDate = new Date(w.date);
          const diffWeeks = Math.floor((now - workoutDate) / (1000 * 60 * 60 * 24 * 7));
          if (diffWeeks < weeks && diffWeeks >= 0) {
            weekMap[weeks - diffWeeks - 1]++;
          }
        });
      
        labels = labelsArray;
        data = weekMap;
      }
      

      return {
        labels,
        datasets: [{
          data,
          color: (opacity = 1) => `rgba(139, 28, 59, ${opacity})`,
          strokeWidth: 2,
        }],
      };
    } catch (err) {
      console.error('Error preparing chart data:', err);
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }
  }, [workouts, selectedPeriod]);

  // ✅ Calculate dynamic chart width
  const chartWidth = Math.max(chartData?.labels?.length * 50, screenWidth - 32);

  // Pad data slightly to avoid flat lines
  let paddedData = [...chartData.datasets[0].data];
  const uniqueValues = new Set(paddedData);

  if (uniqueValues.size === 1) {
    // Pad to avoid visual artifacts
    paddedData[0] += 0.01;
  }

  chartData.datasets[0].data = paddedData;

  const maxValue = Math.max(...paddedData);
  const segmentsCount = Math.max(2, Math.ceil(maxValue));



  if (!chartData || chartData.datasets[0].data.every(v => v === 0)) {
    return (
      <View style={styles.chartCard}>
        <View style={styles.chartFilters}>
          <Text style={styles.filterLabel}>Workouts</Text>
          <Text style={styles.filterLabel}>{selectedPeriod}</Text>
        </View>
        <Text style={{ textAlign: 'center', color: '#888', paddingVertical: 20 }}>
          No workout data to display
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartFilters}>
        <Text style={styles.filterLabel}>Workouts</Text>
        <Text style={styles.filterLabel}>{selectedPeriod}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        fromZero={true}
        withInnerLines={true}
        yLabelsOffset={10}
        withHorizontalLines={true} 
        withVerticalLines={false} 
        withVerticalLabels={true}
        formatYLabel={(y) => `${parseInt(y)}`}
        segments={segmentsCount} // ⬅ dynamic segments
        style={[styles.chart, { marginLeft: -30 }]}
      />

      </ScrollView>
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  //segments: 3,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: ({ index, dataset }) => {
    // hide the artificial dot
    if (dataset.data[index] % 1 !== 0) {
      return { r: '0' };
    }
    return {
      r: '4',
      strokeWidth: '2',
      stroke: '#800000',
    };
  },
  propsForBackgroundLines: {
    strokeWidth: 1, // remove Y axis grid duplication
  },
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  chart: {
    //borderRadius: 8,
    //marginRight: 16, // gives spacing at the end of scroll
  },
});

export default WorkoutChart;
