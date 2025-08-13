import HeadphonesIcon from "@mui/icons-material/Headphones";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChildCareIcon from '@mui/icons-material/ChildCare';

export const drawerMenuOptions = [
  { text: "Home", icon: <LibraryMusicIcon sx={{fontSize: "2rem"}}/>, route: "/home" },
  { text: "DJ", icon: <SupportAgentIcon sx={{fontSize: "2rem"}}/>, route: "/dj" },
  { text: "Kids DJ", icon: <ChildCareIcon sx={{fontSize: "2rem"}}/>, route: "/kids-dj" },
];

export const routeMatchesText = (text,route) => {
    switch(route){
      case "/home":
        return text === "Home";
      case "/dj":
        return text === "DJ"
      case "/kids-dj":
        return text === "Kids DJ"
      default:
        return false
    }
}