
import '../../weather.css';
import cloudyDay from '../../assets/cloudyDay.png';
import rainyDay from '../../assets/rainyDay.png';
import rainy from '../../assets/rainy.png'


const DailyItem = props => {
  const { forecastDetails} = props;
  const { icon, datetime, feelslikemin, feelslikemax, sunrise, sunset } =
    forecastDetails || {};

  const minTemp = feelslikemin ? Math.round((feelslikemin - 32) * 0.55) : '';
  const maxTemp = feelslikemax ? Math.round((feelslikemax - 32) * 0.55) : '';

  const date = datetime ? new Date(datetime) : new Date();
  const dayLabel = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });

  const iconMap = {
  'cloudy': cloudyDay,
  'rain': rainyDay,
  'partly-cloudy-day':rainy
};
  const image = iconMap[icon] || '';

  return (
    <li className="daily-card">
          <p className="daily-date">{dayLabel}</p>
          <div className="daily-times">
            <p className="daily-time">🌅 {sunrise}</p>
            <p className="daily-time">🌇 {sunset}</p>
          </div>
          <img src={image} className="daily-icon" alt={icon || 'weather-icon'} />
          <p className="daily-condition">{icon}</p>
          <div className="daily-temp">
            <span className="temp-max">{maxTemp}°</span>
            <span className="temp-min">/ {minTemp}°</span>
          </div>
    </li>
  );
};

export default DailyItem