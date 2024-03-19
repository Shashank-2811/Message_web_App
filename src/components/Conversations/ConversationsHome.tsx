import { useNavigate, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { useEffect } from "react";

import ConversationsLayout from "./List/ConversationsLayout";
import { paramsAtom } from "../../utils/lib/atom";

const ConversationsHome = () => {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [globalParams, setParamsAtom] = useAtom(paramsAtom);
  useEffect(() => {
    if (!params.id) {
      setParamsAtom("");
    }
  }, [params, setParamsAtom, navigate]);
  return (
    // @ts-ignore
    <ConversationsLayout>
      
    </ConversationsLayout>
  );
};

export default ConversationsHome;
