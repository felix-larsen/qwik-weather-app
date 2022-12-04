import { component$, Resource, useClientEffect$, useResource$, useStore } from '@builder.io/qwik';

interface ClockStore {
  hour: number;
  minute: number;
  second: number;
}
interface Weather {
  weathercode: number;
  temperature: number;
}
interface LocationStore {
  lat: number;
  long: number;
}

export default component$(() => {
  const clockStore = useStore<ClockStore>({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const locationStore = useStore<LocationStore>({
    lat: 53.55,
    long: 9.99
  });

  const weatherResource = useResource$<Weather>(({ track, cleanup }) => {
    // rerun when minute changes --> rerun every minute
    track(() => clockStore.minute);
    const controller = new AbortController();
    cleanup(() => controller.abort());
    return getWeather(locationStore.lat, locationStore.long, controller);
  });

  useClientEffect$(({ track }) => {
    updateClock(clockStore);
    track(clockStore);
    const timerId = setTimeout(() => updateClock(clockStore), 1000);
    return () => clearTimeout(timerId);
  });
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white" >
      <div className='text-5xl'>
        Hello Weather! What's up?
      </div>
      <div className='text-5xl'>
        <br />
        -<br />
        <br />
      </div>
      <div className='text-4xl'>
        <Resource
          value={weatherResource}
          onPending={() => <>Loading...</>}
          onRejected={(error) => <>Error: {error.message}</>}
          onResolved={(weather) => (
            <div>
              At {clockStore.hour}:{clockStore.minute < 10 ? "0" : ""}{clockStore.minute}:{clockStore.second < 10 ? "0" : ""}{clockStore.second} it's {weather.temperature}° and {getStringFromWeathercode(weather.weathercode)} in Hamburg.
            </div>
          )}
        />
      </div>
    </div>
  );
});

export function updateClock(store: ClockStore) {
  const now = new Date();
  store.second = now.getSeconds();
  store.minute = now.getMinutes();
  store.hour = now.getHours();
}

export async function getWeather(
  lat: number,
  long: number,
  controller?: AbortController
): Promise<Weather> {
  console.log('FETCH', `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`);
  const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`, {
    signal: controller?.signal,
  });
  console.log('FETCH resolved');
  const json = await resp.json();
  console.log(json);
  return {
    temperature: json['current_weather']['temperature'],
    weathercode: json['current_weather']['weathercode'],
  };
}

export function getStringFromWeathercode(weathercode: number) {
  // https://open-meteo.com/en/docs
  switch (weathercode) {
    case 0:
      return "clear sky";
    case 1:
      return "mainly clear";
    case 2:
      return "partly couldy";
    case 3:
      return "overcast";
    case 45:
    case 48:
      return "foggy";
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return "drizzling";
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return "raining";
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return "snowing";
    case 95:
    case 96:
    case 99:
      return "storming";
    default:
      return "unknown"
  }
}