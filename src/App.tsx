import { About } from "./components/About";
import { Actions } from "./components/Actions";
import { AnimationManager } from "./components/AnimationManager";
import { AppContext, AppContextProvider } from "./AppContext";
import { Canvas } from "./components/Canvas";
import { Container } from "./components/Container";
import { Content } from "./components/Content";
import { Controls } from "./components/Controls";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Recording } from "./components/Recording";
import { Sidebar } from "./components/Sidebar";
import { useContext } from "react";
import { Video } from "./components/Video";

import "./App.css";
import { FPS } from "./components/FPS";

function AppContent() {
  const [{ start, videoSrc }] = useContext(AppContext);
  return (
    <>
      <Header />

      <Container>
        {start && <Recording />}
        <Sidebar side="left">
          <Controls>
            <AnimationManager />
          </Controls>
          {!start && videoSrc && (
            <Controls>
              <Video />
            </Controls>
          )}
          <Actions />
        </Sidebar>
        <Sidebar side="right">
          <About />
        </Sidebar>
        <Canvas />
        <FPS />
        <Content />
      </Container>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
