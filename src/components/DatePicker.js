import { Text, View } from 'react-native'
import React, { Component } from 'react'
import CalendarPicker from 'react-native-calendar-picker';

export default class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
        };
        this.onDateChange = this.onDateChange.bind(this);

    }

    onDateChange(date) {
        this.setState({
            selectedStartDate: date,
        });

        if (this.props.onDateChange) {
            this.props.onDateChange(date);
        }

    }

    render() {
        const { selectedStartDate } = this.state;
        return (
            <View>
                <CalendarPicker
                    onDateChange={this.onDateChange}
                    selectedDayStyle={{ backgroundColor: '#912338', height: 45, width: 40, borderRadius: 10, marginTop: 5 }}
                    selectedDayTextColor='#fff'
                    textStyle={{ fontSize: 14, color: '#333' }}
                    selectedStartDate={selectedStartDate}
                    previousTitle="< prev"
                    nextTitle="next >"
                    previousTitleStyle={{ color: '#912338', fontSize: 16, fontWeight: 'bold' }}
                    nextTitleStyle={{ color: '#912338', fontSize: 16, fontWeight: 'bold' }}
                    todayBackgroundColor="#912338"
                    monthTitleStyle={{ color: '#912338', fontSize: 16, fontWeight: 'bold' }}
                    yearTitleStyle={{ color: '#912338', fontSize: 18, fontWeight: 'bold' }}
                />
            </View>
        )
    }
}