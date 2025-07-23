// src/components/detail/CombinationDetail.jsx

import React from 'react';
import { Text, LoadingOverlay } from '@mantine/core';
import { useCombinationDetail } from '../../hooks/useCombinationDetail';
import MatchHistory from './MatchHistory';

/**
 * 조합 상세 정보(매치 기록)를 보여주는 책임을 가진 컴포넌트.
 * 데이터 페칭, 로딩, 에러 상태를 스스로 관리합니다.
 * @param {object} combination - combinationId와 champions 정보가 담긴 조합 객체
 */
const CombinationDetail = ({ combination }) => {
    // ✅ 역할 위임: 상세 데이터 조회에 대한 모든 책임을 useCombinationDetail 훅에 맡김
    const { data, isLoading, isError, error } = useCombinationDetail(combination.combinationId);

    // 1. 로딩 중 UI
    if (isLoading) {
        return (
            <div style={{ position: 'relative', minHeight: '100px' }}>
                <LoadingOverlay visible={true} transitionProps={{ transition: 'fade', duration: 150 }} />
            </div>
        );
    }

    // 2. 에러 발생 시 UI
    if (isError) {
        return <Text size="sm" c="red" ta="center" py="sm">오류: {error.message}</Text>;
    }

    // 3. 성공 시 UI
    const gameDetails = data?.gameDetails || [];

    return gameDetails.length > 0 ? (
        <MatchHistory
            champions={combination.champions || []}
            gameDetails={gameDetails}
        />
    ) : (
        <Text size="sm" c="dimmed" ta="center" py="sm">
            매치 기록이 없습니다.
        </Text>
    );
};

export default CombinationDetail;