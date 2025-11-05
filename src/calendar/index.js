import React, { Component } from "react";
import { View, TouchableOpacity, Text, LayoutAnimation } from "react-native";
import PropTypes from "prop-types";

import XDate from "xdate";
import dateutils from "../dateutils";
import { xdateToData, parseDate } from "../interface";
import styleConstructor from "./style";
import Day from "./day/basic";
import UnitDay from "./day/period";
import MultiDotDay from "./day/multi-dot";
import MultiPeriodDay from "./day/multi-period";
import SingleDay from "./day/custom";
import CalendarHeader from "./header";
import shouldComponentUpdate from "./updater";
import YearModal from "./year-modal";

const EmptyArray = [];

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    let currentMonth;
    if (props.current) {
      currentMonth = parseDate(props.current);
    } else {
      currentMonth = XDate();
    }
    this.state = {
      currentMonth,
      isYearViewActive: false,
      yearPageIndex: Math.ceil(this.currentYear() / 35),
      selectedYear: this.currentYear(),
    };
    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.pressDay = this.pressDay.bind(this);
    this.longPressDay = this.longPressDay.bind(this);
    this.shouldComponentUpdate = shouldComponentUpdate;
    this.swapView = this.swapView.bind(this);
    this.nextYearPage = this.nextYearPage.bind(this);
    this.prevYearPage = this.prevYearPage.bind(this);
    this.pressYear = this.pressYear.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const current = parseDate(nextProps.current);
    if (
      current &&
      current.toString("yyyy MM") !==
        this.state.currentMonth.toString("yyyy MM")
    ) {
      this.setState({
        currentMonth: current.clone(),
      });
    }
  }

  updateMonth(day, doNotTriggerListeners) {
    if (
      day.toString("yyyy MM") === this.state.currentMonth.toString("yyyy MM")
    ) {
      return;
    }
    this.setState(
      {
        currentMonth: day.clone(),
      },
      () => {
        if (!doNotTriggerListeners) {
          const currMont = this.state.currentMonth.clone();
          if (this.props.onMonthChange) {
            this.props.onMonthChange(xdateToData(currMont));
          }
          if (this.props.onVisibleMonthsChange) {
            this.props.onVisibleMonthsChange([xdateToData(currMont)]);
          }
        }
      }
    );
  }

  animation() {
    const CustomLayoutSpring = {
      duration: 400,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
    };
    LayoutAnimation.configureNext(CustomLayoutSpring);
  }

  currentYear() {
    return this.props.current.getFullYear();
  }

  _handleDayInteraction(date, interaction) {
    const day = parseDate(date);
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    if (
      !(minDate && !dateutils.isGTE(day, minDate)) &&
      !(maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      const shouldUpdateMonth =
        this.props.disableMonthChange === undefined ||
        !this.props.disableMonthChange;
      if (shouldUpdateMonth) {
        this.updateMonth(day);
      }
      if (interaction) {
        interaction(xdateToData(day));
      }
    }
  }

  pressDay(date) {
    this._handleDayInteraction(date, this.props.onDayPress);
  }

  pressYear(year) {
    this.setState({
      currentMonth: XDate(this.state.currentMonth.toString(`${year}-MM-dd`)),
    });
    this.swapView();
  }

  longPressDay(date) {
    this._handleDayInteraction(date, this.props.onDayLongPress);
  }

  addMonth(count) {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  }

  nextYearPage() {
    if (this.state.yearPageIndex < 60) {
      this.setState({ yearPageIndex: this.state.yearPageIndex + 1 });
    }
  }

  prevYearPage() {
    if (this.state.yearPageIndex > 55) {
      this.setState({ yearPageIndex: this.state.yearPageIndex - 1 });
    }
  }

  renderDay(day, id) {
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = "";
    if (this.props.disabledByDefault) {
      state = "disabled";
    } else if (
      (minDate && !dateutils.isGTE(day, minDate)) ||
      (maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      state = "disabled";
    } else if (!dateutils.sameMonth(day, this.state.currentMonth)) {
      state = "disabled";
    } else if (dateutils.sameDate(day, XDate(this.props.current))) {
      state = "today";
    }
    let dayComp;
    if (
      !dateutils.sameMonth(day, this.state.currentMonth) &&
      this.props.hideExtraDays
    ) {
      if (["period", "multi-period"].includes(this.props.markingType)) {
        dayComp = <View key={id} style={{ flex: 1 }} />;
      } else {
        dayComp = <View key={id} style={this.style.dayContainer} />;
      }
    } else {
      const DayComp = this.getDayComponent();
      const date = day.getDate();
      dayComp = (
        <DayComp
          key={id}
          state={state}
          theme={this.props.theme}
          onPress={this.pressDay}
          onLongPress={this.longPressDay}
          date={xdateToData(day)}
          marking={this.getDateMarking(day)}
          sameDay={dateutils.sameDate(day, XDate(this.props.current))}
        >
          {date}
        </DayComp>
      );
    }
    return dayComp;
  }

  getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
      case "period":
        return UnitDay;
      case "multi-dot":
        return MultiDotDay;
      case "multi-period":
        return MultiPeriodDay;
      case "custom":
        return SingleDay;
      default:
        return Day;
    }
  }

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }
    const dates =
      this.props.markedDates[day.toString("yyyy-MM-dd")] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  renderWeekNumber(weekNumber) {
    return (
      <Day
        key={`week-${weekNumber}`}
        theme={this.props.theme}
        marking={{ disableTouchEvent: true }}
        state="disabled"
      >
        {weekNumber}
      </Day>
    );
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);

    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View style={this.style.week} key={id}>
        {week}
      </View>
    );
  }

  swapView() {
    this.setState({ isYearViewActive: !this.state.isYearViewActive });
    this.animation();
  }

  renderYears(years) {
    yearList = [];

    for (
      let i = this.state.yearPageIndex * 35 - 34;
      i < this.state.yearPageIndex * 35 + 1;
      i++
    ) {
      const textStyle = [
        this.style.text,
        this.state.selectedYear === i
          ? { color: "#FB6964", fontWeight: "bold" }
          : null,
      ];

      yearList.push(
        <TouchableOpacity
          key={`${i} - year`}
          style={this.style.year}
          onPress={() => {
            this.pressYear(i);
            this.setState({ selectedYear: i });
          }}
        >
          <Text style={textStyle}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return yearList;
  }

  render() {
    const years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const days = dateutils.page(this.state.currentMonth, this.props.firstDay);
    const weeks = [];
    const groupedYears = this.renderYears(years);

    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }

    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current
        .clone()
        .addMonths(1, true)
        .setDate(1)
        .addDays(-1)
        .toString("yyyy-MM-dd");
      if (
        this.props.displayLoadingIndicator &&
        !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])
      ) {
        indicator = true;
      }
    }

    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          onTitlePress={this.swapView}
          isYearViewActive={this.state.isYearViewActive}
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          showIndicator={indicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          hideDayNames={this.state.isYearViewActive || this.props.hideDayNames}
          weekNumbers={this.props.showWeekNumbers}
          onPressArrowLeft={
            this.state.isYearViewActive
              ? this.prevYearPage
              : this.props.onPressArrowLeft
          }
          onPressArrowRight={
            this.state.isYearViewActive
              ? this.nextYearPage
              : this.props.onPressArrowRight
          }
        />
        {this.state.isYearViewActive ? (
          <View style={this.style.yearView}>{groupedYears}</View>
        ) : (
          <View style={this.style.monthView}>{weeks}</View>
        )}
      </View>
    );
  }
}

export default Calendar;
