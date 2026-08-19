import { useCallback, useEffect, useState } from "react";
import {
  createMilestone,
  deleteMilestone,
  getMilestones,
  updateMilestone,
} from "../../../api/milestone.js";

const sortByDueDate = (milestones) =>
  [...milestones].sort(
    (left, right) => new Date(left.dueDateTime) - new Date(right.dueDateTime),
  );

function useMilestones(teamId) {
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  const refresh = useCallback(() => {
    setRefreshToken((current) => current + 1);
  }, []);

  useEffect(() => {
    if (teamId == null) return undefined;

    const controller = new AbortController();

    const loadMilestones = async () => {
      setMilestones([]);
      setError("");
      setIsLoading(true);

      try {
        const result = await getMilestones(teamId, {
          signal: controller.signal,
        });

        setMilestones(sortByDueDate(Array.isArray(result) ? result : []));
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error(requestError);
        setError(
          requestError?.message ||
            "마일스톤을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadMilestones();
    return () => controller.abort();
  }, [refreshToken, teamId]);

  const create = async (body) => {
    const created = await createMilestone(teamId, body);
    setMilestones((current) => sortByDueDate([...current, created]));
    return created;
  };

  const update = async (milestoneId, body) => {
    const updated = await updateMilestone(teamId, milestoneId, body);
    setMilestones((current) =>
      sortByDueDate(
        current.map((milestone) =>
          milestone.milestoneId === milestoneId ? updated : milestone,
        ),
      ),
    );
    return updated;
  };

  const remove = async (milestoneId) => {
    await deleteMilestone(teamId, milestoneId);
    setMilestones((current) =>
      current.filter((milestone) => milestone.milestoneId !== milestoneId),
    );
  };

  return {
    milestones: teamId == null ? [] : milestones,
    isLoading: teamId == null ? false : isLoading,
    error: teamId == null ? "" : error,
    create,
    update,
    remove,
    refresh,
  };
}

export default useMilestones;
