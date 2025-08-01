import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useGameRecord = (gameId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!gameId) return;

        const fetchGameRecord = async () => {
            try {
                setLoading(true);
                setError(null);
                // 백엔드 API 엔드포인트를 호출합니다.
                const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/record`);

                if (!response.ok) {
                    throw new Error('데이터를 불러오는데 실패했습니다.');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGameRecord();
    }, [gameId]); // gameId가 변경될 때마다 데이터를 다시 가져옵니다.

    return { data, loading, error };
};