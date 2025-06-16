import { useState, useEffect } from "react";
import { fetchData } from "@/utils/api"; // Assuming '@/utils/api' is correct

const useFormDataFetch = () => {
  const [hobby, setHobby] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [edu, setEdu] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [business, setBusiness] = useState<any[]>([]);

  useEffect(() => {
    const getHobby = async () => {
      const res = await fetchData("hobbies");
      setHobby(res.hobbies);
    };

    const getCity = async () => {
      const res = await fetchData("cities");
      setCity(res.cities);
    };

    const getEdu = async () => {
      const res = await fetchData("education");
      setEdu(res.education);
    };

    const getProfessions = async () => {
      const res = await fetchData("professions");
      setProfessions(res.professions);
    };

    const getBusiness = async () => {
      const res = await fetchData("business");
      setBusiness(res.Business);
    };

    getHobby();
    getCity();
    getEdu();
    getProfessions();
    getBusiness();
  }, []);

  return { hobby, city, edu, professions, business };
};

export default useFormDataFetch;
