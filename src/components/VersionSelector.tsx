
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronDown } from 'lucide-react';

interface Version {
  version: string;
  build: string;
  label: string;
  status?: string;
}

const versions: Version[] = [
  { version: 'v2.1.3', build: 'BUILD_7749', label: 'v2.1.3 (Current)', status: 'current' },
  { version: 'v2.1.2', build: 'BUILD_7701', label: 'v2.1.2 (Stable)' },
  { version: 'v2.0.8', build: 'BUILD_7642', label: 'v2.0.8 (Legacy)' },
  { version: 'v1.9.4', build: 'BUILD_7523', label: 'v1.9.4 (Archive)' }
];

const VersionSelector: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
      <div className="text-xs text-white/60 font-mono hidden sm:block">VERSION:</div>
      <Select
        value={selectedVersion.version}
        onValueChange={(value) => {
          const version = versions.find(v => v.version === value);
          if (version) setSelectedVersion(version);
        }}
      >
        <SelectTrigger className="w-full sm:w-48 h-7 sm:h-8 bg-transparent border-white/20 text-white hover:border-codi/50 focus:border-codi text-xs font-mono">
          <SelectValue>
            <div className="flex items-center justify-between w-full">
              <span className="text-codi text-xs sm:text-sm">{selectedVersion.version}</span>
              <span className="text-white/40 hidden sm:inline">|</span>
              <span className="text-white/60 text-xs hidden sm:inline">{selectedVersion.build}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/20 z-50 w-full">
          {versions.map((version) => (
            <SelectItem 
              key={version.version} 
              value={version.version}
              className="text-white hover:bg-codi/10 focus:bg-codi/10 font-mono text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                <span className={version.status === 'current' ? 'text-codi' : 'text-white'}>
                  {version.label}
                </span>
                <span className="text-white/40 text-xs mt-1 sm:mt-0 sm:ml-4">{version.build}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VersionSelector;
