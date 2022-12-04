import { component$, useClientEffect$, useStore } from '@builder.io/qwik';

interface ClockStore {
  hour: number;
  minute: number;
  second: number;
}

export default component$(() => {
  const clockStore = useStore<ClockStore>({
    hour: 0,
    minute: 0,
    second: 0,
  });
  
  useClientEffect$(({track}) => {
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
        <br/>
        -<br/>
        <br/>
      </div>
      <div className='text-4xl'>
        At {clockStore.hour}:{clockStore.minute<10 ? "0" : "" }{clockStore.minute}:{clockStore.second<10 ? "0" : "" }{clockStore.second} it's 10° and cloudy in Hamburg.
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
