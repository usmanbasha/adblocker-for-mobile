import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native";
import { showLocation } from "../../utils/functions";
import API_URL from "../../config";
import Loading from "../Loading";
import doc from "../../assets/Homepage/doc.png";

const Search = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchBy, setSearchBy] = useState("name");
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const isFocused = useIsFocused();

  const getDoctorNames = async () => {
    const response = await fetch(`${API_URL}/api/search/doctors`);
    const data = await response.json();
    data.sort((a, b) => a.name.localeCompare(b.name));
    setDoctors(data);
    setLoading(false);
  };

  const filterDoctorsByName = () => {
    setFilteredDoctors(
      doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  useEffect(() => {
    getDoctorNames();
  }, []);

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (search === "")
      setFilteredDoctors([]);
    if (searchBy === "name") {
      if (search === "") {
        setFilteredDoctors(doctors.filter(doctor => doctor.name.toLowerCase()));
      }
      else
        filterDoctorsByName();
    }
  }, [search, doctors, searchBy]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search || search === "") {
      Toast.warn("Please enter a valid query!");
      return;
    }

    if (searchBy === "location") {
      const data = await showLocation(null, search, null);
      console.log(data.length);
      setDoctorData(data);
      console.log("Doctor data by location:", data);
    } else {
      filterDoctorsByName();
    }
  };

  const handlePress = (id) => {
    console.log("Selected doctor ID:", id);
    navigation.navigate('Doctorprofile', { doctorId: id });
  };

  // if (loading) {
  //   return <Loading />
  // }

  return (
    <View className="mt-4 relative">
      <View className="flex-row justify-around items-center mx-4">
        <TouchableOpacity
          onPress={() => setSearchBy("name")}
          style={{
            padding: 10,
            backgroundColor: searchBy === "name" ? 'teal' : 'lightgray',
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white' }}>Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSearchBy("location")}
          style={{
            padding: 10,
            backgroundColor: searchBy === "location" ? 'teal' : 'lightgray',
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white' }}>Location</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mx-4 mt-4">
        <TextInput
          placeholder={`Search by ${searchBy}...`}
          className="p-2 px-4 flex-1 rounded-lg text-[#004D6C] bg-[#ffffff] border-none outline-none"
          value={search}
          ref={inputRef}
          onChangeText={text => setSearch(text)}
          onSubmitEditing={handleSearch}
        />
        <View className="absolute right-10 top-2">
          <AntDesign name="search1" size={24} color="black" />
        </View>
      </View>

      {searchBy === "name" && (
        loading ?
          <Loading />
          :
          <FlatList
            data={filteredDoctors}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePress(item.id)}
                className="p-2 border-b border-gray-200"
              >
                <Text className="text-lg">{item.name}</Text>
                <Text className="text-sm text-gray-600">{item.specializations}</Text>
              </TouchableOpacity>
            )}
            className="absolute top-24 left-0 right-0 bg-white z-10"
          />
      )}

      {searchBy === "location" && doctorData.length > 0 && (
        <FlatList
          data={doctorData}
          keyExtractor={(item) => (item.uid ? item.uid.toString() : Math.random().toString())}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePress(item.uid)}
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: "lightgray",
              }}
            >
              <View style={{ padding: 16, marginTop: 16, borderRadius: 8, backgroundColor: '#F0F4FC' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={doc} //
                  className=" w-24 h-24 "
                />
                  <View style={{ marginLeft: 12 }}>
                  
                    <Text style={{ fontWeight: 'bold', color: '#004D6C' }}>{item.data.name}</Text>
                    <Text style={{ color: '#004D6C' }}>{item.data.specializations}</Text>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                      <Text style={{ color: 'yellow' }}>4.8 ⭐️</Text>
                      <Text style={{ marginLeft: 8, color: '#004D6C' }}>10:30am - 5:30pm</Text>
                    </View> */}
                  </View>
                </View>
                <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#F0F4FC', paddingVertical: 8, borderRadius: 8 }}>
                  <Text style={{ textAlign: 'center', color: '#004D6C', fontSize: 18, fontWeight: 'bold' }}>
                    Book Appointment
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            paddingHorizontal: 4,
            paddingBottom: 24,
          }}
        />
      )}
    </View>
  );
};

export default Search;
