import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_FALLBACK_KEY";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy/events";

const parisCoordinates = { lat: 48.8566, lng: 2.3522 };

const MapWithCheckboxes = () => {
  const [showToilettes, setShowToilettes] = useState(true);
  const [showBuvettes, setShowBuvettes] = useState(true);
  const [showConcerts, setShowConcerts] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("❌ Clé API Google Maps manquante !");
    }
  }, []);

  useEffect(() => {
    const fetchAndGeocode = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/events`);
        const events = data.events || [];
        const locs = [];

        for (const event of events) {
          const venue = event.venue;
          if (!venue || !venue.venue) continue;

          let lat = parseFloat(venue.latitude);
          let lng = parseFloat(venue.longitude);

          if (!lat || !lng) {
            const fullAddress = `${venue.address || ""}, ${venue.city || ""}, ${venue.country || ""}`;
            try {
              const geo = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
                params: {
                  address: fullAddress,
                  key: GOOGLE_MAPS_API_KEY,
                },
              });
              if (geo.data.results.length) {
                const coords = geo.data.results[0].geometry.location;
                lat = coords.lat;
                lng = coords.lng;
              } else {
                console.warn("📭 Adresse non trouvée :", fullAddress);
                continue;
              }
            } catch (err) {
              console.error("❌ Erreur de géocodage :", err);
              continue;
            }
          }

          const location = {
            id: event.id,
            lat,
            lng,
            name: venue.venue,
            description: `🎵 ${event.title}`,
            url: event.url,
          };

          const name = venue.venue.toLowerCase();
          if (name.includes("toilettes")) location.type = "toilettes";
          else if (name.includes("buvette")) location.type = "buvette";
          else if (name.includes("scène") || name.includes("scene")) location.type = "concert";

          locs.push(location);
        }

        setLocations(locs);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des événements :", error);
      }
    };

    fetchAndGeocode();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
        (error) => console.error("❌ Erreur de géolocalisation :", error)
      );
    }
  }, []);

  const calculateRoute = (destination) => {
    if (window.google && userLocation && destination && mapInstance) {
      const directionsService = new window.google.maps.DirectionsService();
      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(mapInstance);

      directionsService.route(
        {
          origin: userLocation,
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK") {
            renderer.setDirections(result);
            setDirectionsRenderer(renderer);
          } else {
            console.error("❌ Erreur d'itinéraire :", status);
          }
        }
      );
    } else {
      alert("Géolocalisation non activée ou destination invalide !");
    }
  };

  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
  };

  return (
    <div>
      <div className="checkboxes" style={{ marginBottom: "10px" }}>
        <label>
          <input type="checkbox" checked={showToilettes} onChange={() => setShowToilettes(!showToilettes)} />
          Toilettes
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={showBuvettes} onChange={() => setShowBuvettes(!showBuvettes)} />
          Buvettes
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input type="checkbox" checked={showConcerts} onChange={() => setShowConcerts(!showConcerts)} />
          Concerts
        </label>
      </div>

      <div className="map-container" style={{ height: "500px", width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ height: "100%", width: "100%" }}
            defaultZoom={13}
            defaultCenter={userLocation || parisCoordinates}
            onLoad={(map) => setMapInstance(map)}
          >
            {locations.map((loc) => {
              if (
                (loc.type === "toilettes" && !showToilettes) ||
                (loc.type === "buvette" && !showBuvettes) ||
                (loc.type === "concert" && !showConcerts)
              ) return null;

              return (
                <Marker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  title={loc.name}
                  onClick={() => setSelectedLocation(loc)}
                />
              );
            })}

            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={clearRoute}
              >
                <div>
                  <h3>{selectedLocation.name}</h3>
                  <p>{selectedLocation.description}</p>
                  <button onClick={() => calculateRoute(selectedLocation)}>Y aller</button>
                  <button onClick={clearRoute} style={{ marginLeft: "10px" }}>Effacer</button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default MapWithCheckboxes;
