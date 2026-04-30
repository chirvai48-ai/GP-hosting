import { Search, MapPin, BriefcaseBusiness } from "lucide-react";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Typography } from "@mui/material";
import type { Searchtype } from "@/types/search";

type Props = {
  searchState: Searchtype;
  onChange: (updatedValue: Searchtype) => void; //because setter function gets updated filters type but returns nothing
};

function SearchBar({searchState, onChange}:Props) {
  const cityValue: string[] = [
    "All cities",
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Yokohama",
    "Nagoya",
    "Sapporo",
    "Fukuoka",
    "Kobe",
    "Hiroshima",
    "Sendai",
  ];

  const experienceValue = [
    {
      name: "All levels",
      value: -1,
    },
    {
      name: "Entry level",
      value: 0,
    },
    {
      name: "0-1 years",
      value: 1,
    },
    {
      name: "2-3 years",
      value: 2,
    },
    {
      name: "3-4 years",
      value: 3,
    },
    {
      name: "4-5 years",
      value: 4,
    },
    {
      name: "5+ years",
      value: 6,
    },
  ];
  const handleCityChange = (event: SelectChangeEvent) => {
    onChange({
      ...searchState,city:event.target.value as string
    })
  };
  const handleExpChange = (event: SelectChangeEvent<number>) => {
    onChange({
      ...searchState,exp:event.target.value as number
    })
  };
  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;
     onChange({
      ...searchState,searchValue:e.target.value
    })
  };
  const handleSliderChange = (_: Event, newValue: number[]) => {
    onChange({
      ...searchState,sliderValue:newValue
    })
  };
  return (
    <div className="p-2 bg-[var(--color-surface)]">
      <p className="font-headline text-sm opacity-60">FIND YOUR NEXT ROLE</p>
      <div className="flex flex-col items-center  p-4 gap-4">
        {/* Search bar on the left */}
        <div className="w-full max-w-4xl  ">
          <div className="flex flex-row w-full justify-center items-center bg-[#f0f2f1] rounded-full p-2 gap-2">
            <Search className="w-4 h-5 shrink-0" color="#145652" />
            <input
              className="flex-1 min-w-0 outline-1 bg-white rounded-md font-headline italic"
              placeholder=" Job title, keyword..."
              onChange={(e) => handleFormInput(e)}
              value={searchState.searchValue}
            />
            <Button
              variant="outlined"
              size="small"
              sx={{
                fontFamily: "Cormorant Garamond",
                fontSize: 12,
                color: "black",
                borderRadius: 2,
                borderColor: "black",
                "&:hover": {
                  bgcolor: "green.200",
                },
                textTransform: "none",
              }}
            >
              Search
            </Button>
          </div>
        </div>
        {/* Salarybar + other filters on the right */}
        <div className="grid grid-cols-2 md:grid-cols-3 justify-center w-full gap-2 p-2 ">
          <div className="flex flex-row justify-center items-center gap-2">
            <MapPin className="w-5 md:w-6 opacity-50 " color="#145652" />
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">City</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchState.city}
                label="City"
                onChange={handleCityChange}
                sx={{
                  fontFamily: "Cormorant Garamond",
                  fontSize: 14,
                }}
              >
                
                {cityValue.map((item, index) => (
                  <MenuItem
                    key={index}
                    value={item}
                    sx={{
                      fontFamily: "Cormorant Garamond",
                      fontSize: 14,
                    }}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <BriefcaseBusiness
              className="w-4 md:w-5 opacity-50"
              color="#145652"
            />
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Experience</InputLabel>
              <Select<number>
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchState.exp}
                label="Experience"
                onChange={handleExpChange}
                sx={{
                  fontFamily: "Cormorant Garamond",
                  fontSize: 14,
                }}
              >
                
                {experienceValue.map((item, index) => (
                  <MenuItem
                    key={index}
                    value={item.value}
                    sx={{
                      fontFamily: "Cormorant Garamond",
                      fontSize: 14,
                    }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className=" px-6 flex flex-col items-center justify-center col-span-2 md:col-span-1 ">
            <Slider
              getAriaLabel={() => "Salary Range"}
              value={searchState.sliderValue}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={1}
              size="small"
              sx={{
                "& .MuiSlider-track": {
                  backgroundColor: "#C9A84C",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#828787",
                },
                "& .MuiSlider-thumb": {
                  backgroundColor: "#145652",
                  height: 8,
                  width: 8,
                },
              }}
            />
            <Typography
              variant="caption"
              className="text-gray-500 text-xs sm:text-sm "
              sx={{
                fontFamily: "Cormorant Garamond",
              }}
            >
              Salary range:{" "}
              <span className="text-secondary font-black text-sm">
                {" "}
                ¥{searchState.sliderValue[0]}k – ¥{searchState.sliderValue[1]}k{" "}
              </span>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
