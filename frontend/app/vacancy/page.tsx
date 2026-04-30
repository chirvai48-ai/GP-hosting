"use client"
import { useState } from "react"
import SearchBar from "@/components/SearchBar"
import Navbar from "@/components/Navbar"
import Filters from "@/components/Filter"
import type { Filterstype } from "@/types/filters"
import type { Searchtype } from "@/types/search"
import VacancySection from "@/components/Vacancies"
const Page = () => {
  const defaultValueFilters:Filterstype = {
    schedule:{
        full_time:true,
        part_time:false,
        contract:true,
        internship:false
    },
    employment:{
        sixdays:true,
        shift_based:true,
        flexible:false,
        fivedays:false
    }
  }
  const defaultValueSearch:Searchtype = {
    sliderValue:[0,100],
    searchValue:"",
    exp:-1,
    city:"All cities"
  }


  const [filters,setFilters] = useState<Filterstype>(defaultValueFilters)
  const [searchState,setSearchState] = useState<Searchtype>(defaultValueSearch)
  return (
    <div>
      <SearchBar searchState={searchState} onChange={setSearchState} />
      <div className="flex flex-row items-start">
      <Filters filters={filters} onChange={setFilters} />
      <VacancySection />
      </div>
    </div>
  )
}

export default Page
