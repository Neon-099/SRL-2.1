export const validateIncident = (title: string, description: string) => {
    if(!title.trim()) return false;
    if(!description.trim())return false;
    return true;
}