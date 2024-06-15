"use client";
import { useEffect, useState } from "react";

export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string;
  details?: {
    abilities: string[];
    stats: { name: string; baseStat: number }[];
    types: string[];
    height?: number;
    weight?: number;
  };
}

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=99")
      .then((response) => response.json())
      .then((data) => {
        const promises = data.results.map((p: Pokemon) =>
          fetch(p.url)
            .then((response) => response.json())
            .then((detailData) => {
              const pokemonData: Pokemon = {
                ...p,
                imageUrl: detailData.sprites.front_default,
                details: {
                  abilities: detailData.abilities.map(
                    (ability: any) => ability.ability.name
                  ),
                  stats: detailData.stats.map((stat: any) => ({
                    name: stat.stat.name,
                    baseStat: stat.base_stat,
                  })),
                  types: detailData.types.map((type: any) => type.type.name),
                  height: detailData.height,
                  weight: detailData.weight,
                },
              };

              if (pokemonData.name === "pikachu") {
                setSelectedPokemon(pokemonData);
              }

              return pokemonData;
            })
        );

        Promise.all(promises).then((pokemonWithDetails) => {
          setPokemon(pokemonWithDetails);
        });
      });
  }, []);

  const handlePokemonClick = (p: Pokemon) => {
    setSelectedPokemon(p);
  };

  return (
    <div className="min-h-screen max-w-screen flex items-center justify-center font-urbanist">
      <div className="w-full mx-auto p-4 flex flex-col items-center justify-center">
        <div className="relative w-full flex flex-col-reverse lg:flex-row mt-5">
          <div className="lg:w-1/2 px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pokemon.map((p) => (
                <div
                  key={p.name}
                  className="p-4 rounded-xl shadow-2xl cursor-pointer hover:scale-105 duration-500 pokemon-card"
                  onClick={() => handlePokemonClick(p)}
                >
                  <img src={p.imageUrl} alt={p.name} className="mx-auto" />
                  <h2 className="text-xl font-bold text-center">{p.name}</h2>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:fixed top-0 right-0 h-screen lg:w-1/2 flex flex-col justify-center items-center lg:p-20 xl:p-40">
            {selectedPokemon && (
              <div className="p-4 rounded-xl shadow-2xl w-full h-fit max-h-screen">
                <h2 className="text-2xl font-bold text-center mb-4">
                  {selectedPokemon.name}
                </h2>
                <img
                  src={selectedPokemon.imageUrl}
                  alt={selectedPokemon.name}
                  className="mx-auto"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-start items-center gap-2">
                    <h3>Abilities:</h3>
                    {selectedPokemon.details?.abilities.map(
                      (ability, index) => (
                        <div
                          key={index}
                          className="py-px px-2 border rounded-md"
                        >
                          {ability}
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h3>Types:</h3>

                    {selectedPokemon.details?.types.map((type, index) => (
                      <div key={index} className="py-px px-2 border rounded-md">
                        {type}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <span>Height: {selectedPokemon.details?.height}</span>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <span>Height: {selectedPokemon.details?.weight}</span>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <span>Stats: </span>
                    <div className="flex flex-wrap gap-x-3">
                      {selectedPokemon.details?.stats.map((stat, index) => (
                        <div key={index}>
                          {stat.name}: {stat.baseStat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          .pokemon-card{
            transform: rotateX(-10deg) rotateY(10deg)
          }
        `}
      </style>
    </div>
  );
}
