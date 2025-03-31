import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Team } from '../data/teams';

interface TeamSelectProps {
  teams: Team[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  excludeTeamId?: string;
}

export default function TeamSelect({ teams, value, onChange, placeholder, excludeTeamId }: TeamSelectProps) {
  const [search, setSearch] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTeam, setCustomTeam] = useState('');

  const filteredTeams = useMemo(() => {
    if (!search) return teams;
    const searchLower = search.toLowerCase();
    return teams.filter(team => 
      team.name.toLowerCase().includes(searchLower) ||
      team.league.toLowerCase().includes(searchLower)
    );
  }, [teams, search]);

  const groupedTeams = useMemo(() => {
    const grouped = filteredTeams.reduce((acc, team) => {
      if (!acc[team.league]) {
        acc[team.league] = [];
      }
      if (team.id !== excludeTeamId) {
        acc[team.league].push(team);
      }
      return acc;
    }, {} as Record<string, Team[]>);

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTeams, excludeTeamId]);

  const handleCustomTeamSubmit = () => {
    if (customTeam.trim()) {
      onChange(customTeam.trim());
      setShowCustomInput(false);
      setCustomTeam('');
    }
  };

  return (
    <div className="relative">
      {!showCustomInput ? (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une équipe..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
            />
          </div>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          >
            <option value="">{placeholder}</option>
            {groupedTeams.map(([league, teams]) => (
              <optgroup key={league} label={league}>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <optgroup label="Autre">
              <option value="custom">Équipe personnalisée...</option>
            </optgroup>
          </select>
        </>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={customTeam}
            onChange={(e) => setCustomTeam(e.target.value)}
            placeholder="Nom de l'équipe..."
            className="flex-1 rounded-lg border border-gray-300 p-2 text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCustomTeamSubmit();
              }
            }}
          />
          <button
            onClick={handleCustomTeamSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Ajouter
          </button>
          <button
            onClick={() => {
              setShowCustomInput(false);
              setCustomTeam('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}