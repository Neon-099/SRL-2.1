
type loadItems = {
    loadItem: string
}

export const LoadingSpinner = ({loadItem}: loadItems) => {
    return(
        <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-500 mt-4 font-medium">{loadItem}...</p>
        </div>
    )
}