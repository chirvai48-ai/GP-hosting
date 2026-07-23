import { useEffect, useRef, useState } from "react";
import { Search, MapPin, BriefcaseBusiness } from "lucide-react";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Typography } from "@mui/material";
import type { Searchtype } from "@/types/search";
import { SALARY_SLIDER_MAX } from "@/lib/jobFilter";

type Props = {
  searchState: Searchtype;
  onChange: (updatedValue: Searchtype) => void;
  onClear: () => void;
};

function formatYen(value: number) {
  if (value >= 1000) {
    const m = value / 1000;
    return `¥${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `¥${value}k`;
}

function SearchBar({ searchState, onChange, onClear }: Props) {
  const [keyword, setKeyword] = useState(searchState.searchValue);

  // Latest searchState in a ref so the debounced push never uses a stale
  // snapshot (which would silently overwrite filters the user changed
  // during the 250ms debounce window).
  const searchStateRef = useRef(searchState);
  useEffect(() => {
    searchStateRef.current = searchState;
  });

  // Sync local keyword when parent resets (e.g. clear-filters)
  useEffect(() => {
    setKeyword(searchState.searchValue);
  }, [searchState.searchValue]);

  // Debounce keyword push to parent
  useEffect(() => {
    if (keyword === searchStateRef.current.searchValue) return;
    const t = setTimeout(() => {
      onChange({ ...searchStateRef.current, searchValue: keyword });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const handleClear = () => {
    // Reset local input immediately so any pending debounce cleanup runs
    // and clears its timeout before it can re-push the old keyword.
    setKeyword("");
    onClear();
  };

  const cityValue: string[] = [
    "すべての勤務地",
    "東京都",
    "大阪府",
    "京都府",
    "神奈川県（横浜）",
    "愛知県（名古屋）",
    "北海道（札幌）",
    "福岡県",
    "兵庫県（神戸）",
    "広島県",
    "宮城県（仙台）",
  ];

  const experienceValue = [
    {
      name: "不問（すべての経験レベル）",
      value: -1,
    },
    {
      name: "未経験歓迎",
      value: 0,
    },
    {
      name: "1年未満",
      value: 1,
    },
    {
      name: "2〜3年",
      value: 2,
    },
    {
      name: "3〜4年",
      value: 3,
    },
    {
      name: "4〜5年",
      value: 4,
    },
    {
      name: "5年以上",
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
    setKeyword(e.target.value);
  };
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    onChange({
      ...searchState,
      sliderValue: Array.isArray(newValue) ? newValue : [newValue, newValue],
    });
  };
  return (
    <div className="p-2 bg-[var(--color-surface)]">
      <p className="font-headline text-sm opacity-60">求人検索</p>
      <div className="flex flex-col items-center  p-4 gap-4">
        {/* Search bar on the left */}
        <div className="w-full max-w-4xl  ">
          <div className="flex flex-row w-full justify-center items-center bg-[#f0f2f1] rounded-full p-2 gap-2">
            <Search className="w-4 h-5 shrink-0" color="#145652" />
            <input
              className="flex-1 min-w-0 outline-1 bg-white rounded-md font-headline italic px-2"
              placeholder=" 職種、キーワード、スキルなど"
              onChange={handleFormInput}
              value={keyword}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={handleClear}
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
              検索条件をクリア
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
                label="勤務地"
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
              <InputLabel id="demo-simple-select-label">経験年数</InputLabel>
              <Select<number>
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchState.exp}
                label="経験年数"
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
              valueLabelFormat={(v) => formatYen(v)}
              min={0}
              max={SALARY_SLIDER_MAX}
              step={100}
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
              給与範囲：{" "}
              <span className="text-secondary font-black text-sm">
                {" "}
                {formatYen(searchState.sliderValue[0])} – {formatYen(searchState.sliderValue[1])}{" "}
              </span>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
