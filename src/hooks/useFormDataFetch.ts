import { useState, useEffect } from "react";
import { fetchData } from "@/utils/api"; // Assuming '@/utils/api' is correct
import streamsService from "@/services/streamsService";

const useFormDataFetch = () => {
  const [hobby, setHobby] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [edu, setEdu] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [business, setBusiness] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);

  useEffect(() => {
    const getHobby = async () => {
      const res = await fetchData("hobbies");
      setHobby(res?.hobbies || []);
    };

    const getCity = async () => {
      const res = await fetchData("cities");
      setCity(res?.cities || []);
    };

    const getEdu = async () => {
      const res = await fetchData("education");
      // Check for both "educations" and "education" keys to handle API response variations
      setEdu(res?.educations || res?.education || []);

      // Log for debugging
      console.log("Education API response:", res);
      console.log(
        "Education data set:",
        res?.educations || res?.education || []
      );
    };

    const getProfessions = async () => {
      const res = await fetchData("professions");
      setProfessions(res?.professions || []);
    };

    const getBusiness = async () => {
      const res = await fetchData("business");
      setBusiness(res?.businesses || []);
    };

    const getStreams = async () => {
      const res = await streamsService.getAllStreams();
      setStreams(res || []);
    };

    getHobby();
    getCity();
    getEdu();
    getProfessions();
    getBusiness();
    getStreams();
  }, []);

  return { hobby, city, edu, professions, business, streams };
};

export default useFormDataFetch;
