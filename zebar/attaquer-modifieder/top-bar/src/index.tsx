/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { createSignal, Show } from "solid-js";
import * as zebar from "zebar";
import WindowsButton from "./Buttons/WindowsButton";
import SearchButton from "./Buttons/SearchButton";
import Workspaces from "./Workspaces/Workspaces";
import TilingBinding from "./TilingBinding/TilingBinding";
import WindowTitle from "./WindowTitle/WindowTitle";
import MediaStatus from "./Media/MediaStatus";
import CurrentApps from "./CurrentApps/CurrentApps";
import Systray from "./Systray/Systray";
import InputMethodStatus from "./InputMethod/InputMethodStatus";
import CpuStatus from "./Cpu/CpuStatus";
import MemoryStatus from "./Memory/MemoryStatus";
import WeatherStatus from "./Weather/WeatherStatus";
import VolumeStatus from "./Volume/VolumeStatus";
import NetworkStatus from "./Network/NetworkStatus";
import BatteryStatus from "./Battery/BatteryStatus";
import TimeStatus from "./Time/TimeStatus";

const providers = zebar.createProviderGroup({
  glazewm: { type: "glazewm" },
  systray: { type: "systray" },
  keyboard: { type: "keyboard" },
  cpu: { type: "cpu", refreshInterval: 5000 },
  memory: { type: "memory", refreshInterval: 5000 },
  network: { type: "network", refreshInterval: 5000 },
  //audio: { type: "audio" },
  battery: { type: "battery", refreshInterval: 10000 },
  date: { type: "date", formatting: "EEE d MMM HH:mm:ss" },
  media: { type: "media" },
});

render(() => <App />, document.getElementById("root"));

function App() {
  const [Output, SetOutput] = createSignal(providers.outputMap);

  providers.onOutput((OutputMap) => SetOutput({ ...OutputMap }));

  const GetActiveWindowTitle = () => {
    const Wm = Output().glazewm;
    if (!Wm) return null;

    const ActiveWindow = Wm.allWindows?.find((Window) => Window.hasFocus);
    if (ActiveWindow) {
      return ActiveWindow.title;
    }

    if (Wm.focusedContainer?.type === "window") {
      return Wm.focusedContainer.title;
    }

    return null;
  };

  return (
    <div class="app">
      <div class="left">
        <WindowsButton glazewm={Output().glazewm} />
        {/* <SearchButton glazewm={Output().glazewm} /> */}
        <Workspaces glazewm={Output().glazewm} />
        <TilingBinding glazewm={Output().glazewm} />
        <MediaStatus media={Output().media} />
      </div>

      <div class="center">
        <Show when={GetActiveWindowTitle()}>
          <span class="separator"></span>
          <span class="process">{GetActiveWindowTitle()}</span>
        </Show>
      </div>

      <div class="right">
        <Systray systray={Output().systray} glazewm={Output().glazewm} />
        <InputMethodStatus glazewm={Output().glazewm} keyboard={Output().keyboard} />
        <CpuStatus cpu={Output().cpu} glazewm={Output().glazewm} />
        <MemoryStatus memory={Output().memory} />
        {Output().weather && <WeatherStatus weather={Output().weather} />}
        <NetworkStatus network={Output().network} glazewm={Output().glazewm} />
        {/* <VolumeStatus audio={Output().audio} glazewm={Output().glazewm} /> */}
        <BatteryStatus battery={Output().battery} glazewm={Output().glazewm} />
        <TimeStatus date={Output().date} glazewm={Output().glazewm} />
      </div>
    </div>
  );
}
