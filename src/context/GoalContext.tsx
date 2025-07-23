import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { Goal } from '../components/features/goals';
import { Task } from '../components/features';  
// Kiểu dữ liệu cho roadmap (tối giản, có thể mở rộng)
export interface RoadmapPhase {
  id: number;
  title: string;
  order_number: number;
  progress: number;
  tasks: Task[];
  milestone?: string;
}

export interface Roadmap {
  goal: {
    id: number;
    name: string;
    deadline: string; // ISO date string
  };
  roadmap: Roadmap; // mảng các giai đoạn (phase + task + milestone)
  timeline: {
    start_date: string;
    end_date: string;
    total_duration: string;     // ví dụ: "184 days"
    remaining_duration: string; // ví dụ: "184 days"
  };
}


interface GoalContextType {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  roadmaps: Record<number, Roadmap>; // key: goalId
  setRoadmaps: React.Dispatch<React.SetStateAction<Record<number, Roadmap>>>;
  reloadGoals: () => Promise<void>;
  reloadRoadmap: (goalId: number) => Promise<void>;
  loading: boolean;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) throw new Error('useGoals must be used within a GoalProvider');
  return context;
};

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [roadmaps, setRoadmaps] = useState<Record<number, Roadmap>>({});
  const [loading, setLoading] = useState(false);

  // Load goals từ API
  const reloadGoals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/goals');
      // Nếu API trả về mảng goals trực tiếp
      console.log("goals data:", data);
      // setGoals(Array.isArray(data) ? data : data.goals || []);
      setGoals(data.goals);
    } catch (e) {
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load roadmap cho 1 goal
  const reloadRoadmap = useCallback(async (goalId: number) => {
    setLoading(true);
    try {
      const data = await apiService.get(`/goals/${goalId}/roadmap`);
      console.log("this is roadmap:", data);

      if (data && data.roadmap && data.goal && data.timeline) {
        const phases = data.roadmap.map((item: any) => ({
          ...item.phase,
          tasks: item.tasks,
          milestone: item.milestone,
        }));

        const fullRoadmap: Roadmap = {
          goal: data.goal,
          roadmap: phases,
          timeline: data.timeline,
        };

        setRoadmaps((prev) => ({
          ...prev,
          [goalId]: fullRoadmap,
        }));
      }
    } catch (e) {
      console.error("Error loading roadmap:", e);
    } finally {
      setLoading(false);
    }
  }, []);


  // Khi user đăng nhập, tự động load goals
  useEffect(() => {
    const fetchGoalsAndRoadmaps = async () => {
      await reloadGoals();
    };

    fetchGoalsAndRoadmaps();
  }, [reloadGoals]);

  useEffect(() => {
    if (goals.length > 0) {
      Promise.all(goals.map(goal => reloadRoadmap(goal.id)));
    }
  }, [goals]); // tách riêng để đảm bảo chạy sau khi goals được cập nhật


  // TODO: Lắng nghe sự kiện cập nhật để reload goals/roadmap khi cần

  return (
    <GoalContext.Provider value={{ goals, setGoals, setRoadmaps, roadmaps, reloadGoals, reloadRoadmap, loading }}>
      {children}
    </GoalContext.Provider>
  );
}; 