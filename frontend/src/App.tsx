import { useState } from "react";
import Input from "./components/Input";
import { BackgroundBeams } from "./ui/background-beams";
import Continer from "./components/Container";
import Logo from "./components/Logo";
import Button from "./components/Button";
import axios from "axios";

function App() {

  const [repoUrl, setRepoURL] = useState("");
  const [repoId, setRepoId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const sendRepoUrl = async () => {
    console.log(repoUrl.length);
    
    if(repoUrl.length === 0) {
      alert("Url required");
      return;
    }
      setIsUploading(true);
      const reponse = await axios.post(`${BACKEND_URL}/deploy`,{
        url: repoUrl
      });
      const repoId = await reponse.data;
      setRepoId(repoId.id);
      setIsUploaded(true);
  }

  if(isUploaded) {
    const statusPoll = setInterval( async ()=> {
        const response = await axios.get(`${BACKEND_URL}/deploy/status?id=${repoId}`);
        const {status, url} = await response.data; 

        if(status === 'deployed'){         
          clearInterval(statusPoll)
          setDeployedUrl(url);
          setIsDeployed(true);
        }
    },1000)
    if(isDeployed){
    }
  }
  return (
    <div className="">
      <Logo />
      <div className="bg-neutral-950 antialiased w-full min-h-screen">
        <div className="grid grid-cols-2" >
          <div className="text-[#D5E2FF] col-span-1 flex flex-col gap-4 justify-center items-center pt-5">
            <div>
            <Continer height="h-70" width="w-96">
              <h3 className="text-xl font-bold">Deploy your GitHub Repository</h3>
              <p className="text-xs">
                Enter the URL of your GitHub repository to deploy it
              </p>
              <Input label={"GitHub Repository URL"}
                onInput={(e) => {
                  setRepoURL(e.target.value);
                }}
              />
              {/* <Button onClick={sendRepoUrl}>{`${!isUploading? 'Upload': ${isDeployed}'Uploading...'  }`} </Button> */}
              <Button type={'submit'} uploading={isUploading} onClick={sendRepoUrl}>{`${!isUploading? "Upload" : !isUploaded? "Uploading..."  : `Deploying (${repoId})` }`} </Button>
            </Continer>
            </div>


          {isDeployed &&  <div>
            <Continer height="h-70" width="w-96">
              <h3 className="text-xl font-bold">Deployment Status</h3>
              <p className="text-xs">
                Your website is successfully deployed 
              </p>
              <Input label={"Deployed URL"}
                value={deployedUrl}
                onInput={(e) => {
                  setRepoURL(e.target.value);
                }}
              />
              <Button type={"button"}  onClick={()=> {
                window.open(deployedUrl,'_blank')
              }}> Vist Website </Button>
            </Continer>
            </div>}
          </div>
        </div>
        <BackgroundBeams />
      </div>
    </div>
  );
}

export default App;
