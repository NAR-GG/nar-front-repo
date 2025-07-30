// src/hooks/useSchedule.js

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useSchedule = (selectedDate) => {
    // API 데이터를 저장할 상태들
    const [scheduleData, setScheduleData] = useState({ date: '', matches: [] });
    const [matchDetails, setMatchDetails] = useState({}); // { matchId: detailData } 형식
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState({}); // { matchId: boolean }
    const [error, setError] = useState(null);

    // selectedDate가 변경될 때마다 일정 목록 API 호출
    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);
            setMatchDetails({}); // 날짜가 바뀌면 상세 정보 캐시 초기화

            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            try {
                const response = await fetch(`${API_BASE_URL}/api/schedule?date=${formattedDate}`);
                if (!response.ok) {
                    throw new Error('데이터를 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                setScheduleData(data);
            } catch (err) {
                setError(err.message);
                setScheduleData({ date: '', matches: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [selectedDate]);

    // 매치 상세 정보를 가져오는 함수 (컴포넌트에서 호출)
    const fetchMatchDetail = async (matchId) => {
        // 이미 데이터가 있거나 로딩 중이면 다시 호출하지 않음
        if (matchDetails[matchId] || detailLoading[matchId]) {
            return;
        }

        setDetailLoading(prev => ({ ...prev, [matchId]: true }));
        try {
            const response = await fetch(`${API_BASE_URL}/api/schedule/matches/${matchId}/detail`);
            if (!response.ok) {
                throw new Error('상세 정보를 불러오는 데 실패했습니다.');
            }
            const detailData = await response.json();
            setMatchDetails(prevDetails => ({ ...prevDetails, [matchId]: detailData }));
        } catch (err) {
            console.error(`Failed to fetch details for match ${matchId}:`, err);
        } finally {
            setDetailLoading(prev => ({ ...prev, [matchId]: false }));
        }
    };

    // 훅이 컴포넌트에게 제공할 값과 함수들
    return { scheduleData, matchDetails, loading, detailLoading, error, fetchMatchDetail };
};