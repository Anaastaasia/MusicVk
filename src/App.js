import React, { useState, useEffect, useRef } from 'react';
import { Panel, Group, Cell, Div, Progress, Title, Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Icon16MoreVertical } from '@vkontakte/icons';
import audioFile from './mus/Slava_KPSS_-_Solnce_mjortvykh_49979309.mp3';
import './App.css';
import iconDefault from './img/Picture.svg';
import iconPlayingPaused from './img/Pictute_dark.svg';

// Track data
const track = {
    title: 'Солнце мёртвых',
    artist: 'Слава КПСС',
    file: audioFile
};

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [hasPlayed, setHasPlayed] = useState(false);
    const audioRef = useRef(new Audio(track.file));

    // Hook to set up event listeners
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    // Function to toggle play and pause
    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
            setHasPlayed(true);
        }
        setIsPlaying(!isPlaying);
    };

    // Function to format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Function to get icon based on play state
    const getIcon = () => {
        return hasPlayed ? iconPlayingPaused : iconDefault;
    };

    return (
        <div className="audio-player-container">
            <Panel>
                <Group separator='hide'>
                    <Cell
                        before={
                            <div className={`icon-container ${isPlaying ? 'playing' : hasPlayed ? 'paused' : ''}`}>
                                <img src={getIcon()} className="icon" alt="icon" />
                                {hasPlayed && (
                                    <div className="equalizer">
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                    </div>
                                )}
                            </div>
                        }
                        after={
                            <div className="cell-after">
                                {formatTime(hasPlayed ? currentTime : duration)}
                                <Icon16MoreVertical fill='#2688EB' style={{ marginLeft: 10 }} />
                            </div>
                        }
                        onClick={togglePlay}
                    >
                        <Title level="3" weight="medium">{track.title}</Title>
                        <Text weight="regular" style={{ color: '#a3a3a3' }}>{track.artist}</Text>
                    </Cell>
                    {hasPlayed && (
                        <Div>
                            <Progress value={(currentTime / duration) * 100} />
                        </Div>
                    )}
                </Group>
            </Panel>
        </div>
    );
};

const App = () => {
    return (
        <div className="app-container">
            <AudioPlayer />
        </div>
    );
};

export default App;
