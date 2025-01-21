import DevFortune from "./components/DevFortune";

function App(){
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Developer's Daily Fortune
        </h1>
        <DevFortune/>
      </div>
    </div>
  )
}

export default App;