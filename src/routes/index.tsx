import { component$ } from '@builder.io/qwik';

export default component$(() => {
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
        At 13:33:47 it's 10° and cloudy in Hamburg.
      </div>
    </div>
  );
});
