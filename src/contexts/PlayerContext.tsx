import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  hasNext: boolean
  hasPrevious: boolean
  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void  
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  playNext: () => void
  playPrevious: () => void
  setPlayerState: (state: boolean) => void
  clearPlayerState: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type Props = {
  children: ReactNode
}

export function PlayerContextProvider({ children }: Props) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const hasPrevious = currentEpisodeIndex > 0 || isShuffling
  const hasNext = (currentEpisodeIndex + 1) < episodeList.length

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }
  
  function togglePlay() {    
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayerState(state: boolean) {
    setIsPlaying(state)
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  function playNext() {
    if (isShuffling) {
      const nextEp = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextEp)
    } else
    if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1) 
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)          
    }      
  }

  return (
    <PlayerContext.Provider value={{ 
      episodeList, 
      currentEpisodeIndex, 
      isPlaying,
      isLooping,
      isShuffling,
      play,
      playList,
      playNext,
      playPrevious,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayerState,
      clearPlayerState,
      hasNext,
      hasPrevious
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}