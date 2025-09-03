import { ThreeDots } from 'react-loader-spinner';
import '../../weather.css';


const HourItem = ({ hourDetails, isLoading }) => {
  const { humidity, temp, datetime} = hourDetails || {};

  console.log(hourDetails)

  return (
    <div className="hour-card">
      {isLoading ? (
        <ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />
      ) : (
        <>
          <p className="hour-time">{datetime}</p>
          <p className="hour-temp">{temp}°</p>
          <p className="hour-humidity">Humidity: {humidity}%</p>
        </>
      )}
    </div>
  );
};

export default HourItem;
