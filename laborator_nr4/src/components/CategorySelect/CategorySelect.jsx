import React, { useCallback } from 'react';
import './file.css';

export const CategorySelect = React.memo(({ categories = [], selectedCategory, setSelectedCategory }) => {
    const handleCategoryChange = useCallback((e) => {
        setSelectedCategory(e.target.value);
    }, [setSelectedCategory]);

    return (
        <div className="category-select">
            <label>Choose a category:</label>

            <select
                value={selectedCategory}
                onChange={handleCategoryChange}
            >
                <option value="" disabled>
                    -- Selecteaza categoria --
                </option>

                {categories.length === 0 ? (
                    <option value="" disabled>
                        Nu s-au gasit
                    </option>
                ) : (
                    categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
});


