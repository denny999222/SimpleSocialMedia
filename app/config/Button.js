import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList } from "react-native";

export default class Button extends Component {

  render(props){

    let { title, task } = this.props

    return(
      <TouchableOpacity onPress = { task }><Text>{ title }</Text></TouchableOpacity>
    )}
}