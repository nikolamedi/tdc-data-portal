import { Trash2 } from "lucide-react";
import { api } from "@utils/api";
import { useState } from "react";
import { NewTokenModal } from "@components/_shared/NewTokenModal";
import { Calendar } from "lucide-react";
import { Button } from "@components/ui/button";

export interface Tokens {
  id: string;
  name: string;
  user_id: string;
  last_access?: string;
  created_at: string;
}
export default ({
  tokens,
  setErrorMessage,
  setSuccessMessage,
  setShowTokenPopup,
  setCreatedToken,
}: {
  tokens: Tokens[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowTokenPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setCreatedToken: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isNewTokenModalOpen, setIsNewTokenModalOpen] = useState(false);
  const [tokenName, setTokenName] = useState("");

  const utils = api.useContext();
  const revokeApiKey = api.user.revokeApiToken.useMutation({
    onSuccess: async () => {
      setSuccessMessage("Token revoked successfully!");
      setShowTokenPopup(false);
      await utils.user.listApiTokens.invalidate();
    },
    onError: () => {
      setErrorMessage("Error occurred while revoking the token.");
      setShowTokenPopup(false);
    },
  });

  const createApiKey = api.user.createApiToken.useMutation({
    onSuccess: async (response) => {
      setCreatedToken(response.result.token);
      setShowTokenPopup(true);
      setIsNewTokenModalOpen(false);
      setTokenName("");
      await utils.user.listApiTokens.invalidate();
    },
    onError: () => {
      setIsNewTokenModalOpen(false);
      setErrorMessage("Error occurred while creating the token.");
      setShowTokenPopup(false);
    },
  });

  return (
    <div>
      <div className="mb-2 flex">
        <Button
          onClick={() => setIsNewTokenModalOpen(true)}
          className="ml-auto px-4 py-2 font-bold"
        >
          New Token
        </Button>
      </div>
      <div>
        {tokens &&
          tokens.map((token: any, index: number) => (
            <div
              key={token.id}
              className={`cursor-pointer p-4 text-sm 
              ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              hover:bg-gray-200
            `}
            >
              <div className="mb-2 flex justify-between">
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="font-bold">Name:</span> {token.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span className="font-bold">Created at:</span>{" "}
                    {new Date(token.created_at)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, ".")}
                  </div>
                  {token.last_access && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span className="font-bold">Last Access: </span>{" "}
                      {new Date(token.last_access)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".")}
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <Trash2
                    onClick={() => revokeApiKey.mutate({ id: token.id })}
                    className="cursor-pointer"
                    size={24}
                    color="red"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      {isNewTokenModalOpen && (
        <NewTokenModal
          value={tokenName}
          setValue={setTokenName}
          onClose={() => setIsNewTokenModalOpen(false)}
          onSubmit={() => createApiKey.mutate({ name: tokenName })}
        />
      )}
    </div>
  );
};
