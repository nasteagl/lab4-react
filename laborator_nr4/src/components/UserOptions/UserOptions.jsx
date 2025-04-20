import React, { useCallback } from 'react';
import './file.css';

const UserOptions = React.memo(({ userName, setUserName, isTimed, setIsTimed, isRandom, setIsRandom, difficulty, setDifficulty }) => {

    const handleNameChange = useCallback((e) => {
        setUserName(e.target.value);
    }, [setUserName]);

    const handleTimedChange = useCallback((e) => {
        setIsTimed(e.target.checked);
    }, [setIsTimed]);

    const handleRandomChange = useCallback((e) => {
        setIsRandom(e.target.checked);
    }, [setIsRandom]);

    const handleDifficultyChange = useCallback((e) => {
        setDifficulty(e.target.value);
    }, [setDifficulty]);

    return (
        <div className="user-options">
            <label>
                Nume:
                <input
                    type="text"
                    value={userName}
                    onChange={handleNameChange}
                    placeholder="Introdu numele tău"
                    required
                />
            </label>

            <div className="checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={isTimed}
                        onChange={handleTimedChange}
                    />
                    Timp limită pentru întrebări
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={isRandom}
                        onChange={handleRandomChange}
                    />
                    Întrebări aleatorii
                </label>
            </div>

            <div className="category-select">
                <label>
                    Dificultate:
                    <select
                        value={difficulty}
                        onChange={handleDifficultyChange}
                        required
                    >
                        <option value="">Selectează dificultatea</option>
                        <option value="Ușor">Ușor</option>
                        <option value="Mediu">Mediu</option>
                        <option value="Greu">Greu</option>
                    </select>
                </label>
            </div>
        </div>
    );
});

export default UserOptions;
