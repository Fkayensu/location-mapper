import axios from "axios";

const form = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const config = require("../config/config.js");

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${config.key}`
    )
    .then(
      (response) => {
        if (response.data.status !== "OK") {
          throw new Error("Could not fetch location!");
        }
        const coordinates = response.data.results[0].geometry.location;

        const map = new google.maps.Map(
          document.getElementById("map")! as HTMLElement,
          {
            center: coordinates,
            zoom: 13,
          }
        );

        new google.maps.Marker({
          position: coordinates,
          map: map,
          // title: 'Uluru'
        });
      }
      //   console.log(response);
    )
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });

  // send this to Google's api
}

form.addEventListener("submit", searchAddressHandler);
