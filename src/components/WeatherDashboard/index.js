import {Component} from 'react';
import {ThreeDots} from 'react-loader-spinner';
import DailyItem from '../DailyItem'
import HourItem from '../HourItem'
import '../../weather.css';



class WeatherDashboard extends Component {
  state = {
    name: '',
    temp: '',
    searchInput: '',
    location: '',
    mainImg: '',
    condition: '',
    searchedData: '',
    forecast: [],
    windSpeed: 0,
    windDirection: '',
    humidit: 0,
    srise: '',
    sset: '',
    hour: [],
    lat: '',
    lng: '',
    isLoading: false,
    error: null,
  };

  componentDidMount() {
    this.getMyLocation();
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value});
  };

  getBlogItemData = async o => {
    this.setState({
      isLoading: true,
    });
    this.setState({searchInput: ''});


    const re = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${o}?unitGroup=us&key=3BHQ74CEVSVY3MJMWHJJG7HFM&contentType=json`,
    );
    const r = await re.json();

    this.setState({forecast: r.days.slice(1, 8)});
    const {sunrise, sunset, hours} = r.days[0];

    const hourDetail = hours.map(eachHourData => ({
      temp: Math.round((eachHourData.temp - 32) * 0.55, 2),
      datetime: eachHourData.datetime,
      humidity: eachHourData.humidity,
    }));

     this.setState({hour: hourDetail, srise: sunrise, sset: sunset});

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2cab70eda4434e46b0165459240402&q=${o}&aqi=yes`,
    );

    const data = await response.json();

    this.setState({searchedData: data}, this.updateData);
  };

  getAnyData = async () => {
    this.setState({
      isLoading: true,
    });
    const {searchInput} = this.state;

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2cab70eda4434e46b0165459240402&q=${searchInput}&aqi=yes`,
    );

    const re = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchInput}?unitGroup=us&key=3BHQ74CEVSVY3MJMWHJJG7HFM&contentType=json`,
    );
    if (response.ok === true && re.ok === true) {
      const r = await re.json();
      this.setState({forecast: r.days.slice(1, 8)});
      const {hours} = r.days[0];

      const hoursDetail = hours.map(eachHourData => ({
        temp: Math.round((eachHourData.temp - 32) * 0.55, 2),
        datetime: eachHourData.datetime,
        humidity: eachHourData.humidity,
      }));

      this.setState({hour: hoursDetail});
      const data = await response.json();
      this.setState({searchedData: data}, this.updateData);
    } else {
      this.fake();
    }
  };

  fake = () => {
    alert('wrong input');
    this.setState({searchInput: ''});
    this.setState({
      isLoading: false,
    });
  };

  updateData = () => {
    const {searchedData} = this.state;

    if (searchedData?.current && searchedData?.location) {
      const {current, location} = searchedData;
      this.setState({
        temp: current.temp_c,
        location: location.name,
        condition: current.condition?.text || '',
        mainImg: current.condition?.icon || '',
        humidit: current.humidity,
        windDirection: current.wind_dir,
        windSpeed: current.wind_kph,
        isLoading: false,
      });
    } else {
      console.error('Invalid API response structure', searchedData);
      this.setState({error: 'Invalid API response format.', isLoading: false});
    }
  };

  enter = event => {
    if (event.key === 'Enter') {
      this.getAnyData();
    }
  };

  getMyLocation = () => {
    const location = window.navigator && window.navigator.geolocation;

    if (location) {
      this.setState({isLoading: true, error: null});
      location.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          this.setState({lat: latitude, lng: longitude}, () => {
            this.getLoc(latitude, longitude);
          });
        },
        error => {
          console.error('Error getting location:', error);
          this.setState({
            lat: 'err-latitude',
            lng: 'err-longitude',
            error: 'Could not retrieve location.',
            isLoading: false,
          });
        },
        {timeout: 10000},
      );
    } else {
      this.setState({error: 'Geolocation is not supported by your browser.', isLoading: false});
    }
  };

  getLoc = async (l1, l2) => {
    try {
      const locResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${l1}&lon=${l2}`,
      );
      if (!locResponse.ok) {
        throw new Error(`Error fetching location: ${locResponse.status}`);
      }
      const locData = await locResponse.json();
      this.getBlogItemData(locData?.display_name);
    } catch (error) {
      console.error('Error fetching location name:', error);
      this.setState({error: 'Failed to retrieve location name.', isLoading: false});
    }
  };

  empty = () => {
    this.setState({searchInput: ''});
  };

  render() {
    const {
      temp,
      searchInput,
      location,
      mainImg,
      condition,
      forecast,
      windSpeed,
      windDirection,
      humidit,
      sset,
      srise,
      hour,
      lat,
      lng,
      isLoading,
      error,
    } = this.state;

    return (
      <div className="bg1">
        <h1>Weather Dashboard</h1>
        <div className="search-input-container">
          <input
            type="search"
            placeholder="Search"
            className="search-input"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            onKeyDown={this.enter}
            onClick={this.empty}
          />
          <img
            src="https://assets.ccbp.in/frontend/react-js/app-store/app-store-search-img.png"
      alt="search icon"
      className="search-icon"
            onClick={this.getAnyData}
          />
        </div>

         <button className="home" type="button" onClick={this.getMyLocation}>
          home
        </button>

    {error && <p className="error-message">{error}</p>}

      <div className="upper">
        {isLoading ? (
      <ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />
      ) : (
      <>
        <h1 className="weather-location-title">{location}</h1>
        <div className="weather-card-grid">
          <div className="weather-card temp-card">
            <p className="card-label">Temperature</p>
            <p className="card-value">{temp}°C</p>
          </div>
          <div className="weather-card condition-card">
            <p className="card-label">Condition</p>
            <p className="card-value">{condition}</p>
          </div>
          <div className="weather-card humidity-card">
            <p className="card-label">Humidity</p>
            <p className="card-value">{humidit}%</p>
          </div>
          <div className="weather-card wind-speed-card">
            <p className="card-label">Wind Speed</p>
            <p className="card-value">{windSpeed} kph</p>
          </div>
          <div className="weather-card wind-direction-card">
            <p className="card-label">Wind Direction</p>
            <p className="card-value">{windDirection}</p>
          </div>
          <div className="weather-card sunrise-card">
            <p className="card-label">Sunrise</p>
            <p className="card-value">{srise}</p>
          </div>
          <div className="weather-card sunset-card">
            <p className="card-label">Sunset</p>
            <p className="card-value">{sset}</p>
          </div>
          <div className="weather-card latitude-card">
            <p className="card-label">Latitude</p>
            <p className="card-value">{lat}</p>
          </div>
          <div className="weather-card longitude-card">
            <p className="card-label">Longitude</p>
            <p className="card-value">{lng}</p>
          </div>
          <div className="weather-card icon-card">
            <img src={mainImg} alt="weather icon" className="weather-icon-img" />
          </div>
        </div>
      </>
    )}
      </div>

  <h1>Daily Forecast</h1>
  <ul className="bg2">
    {forecast.map(day => (
      <DailyItem key={day?.datetime} forecastDetails={day} />
    ))}
  </ul>

  <h1>Hourly Forecast</h1>

  <div className="bg4">
    {hour.map(day => (
      <HourItem key={day?.datetime} hourDetails={day} isLoading={isLoading} />
    ))}
  </div>
</div>

    );
  }
}

export default WeatherDashboard;